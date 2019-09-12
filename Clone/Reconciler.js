import { createDomElement, updateDomElementProperties } from "./DomUtils";
import { createInstance } from "./Component";
import { CLASS_COMPONENT, DELETION, ENOUGH_TIME, HOST_COMPONENT, HOST_ROOT, PLACEMENT, UPDATE } from "./Constants";

// Global state
const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;

function render(element, containerDom) {
  updateQueue.push({
    from: HOST_ROOT,
    domElement: containerDom,
    newProps: { children: element }
  });
  requestIdleCallback(performWork);
}

function scheduleUpdate(instance, partialState) {
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance: instance,
    partialState: partialState
  });
  requestIdleCallback(performWork);
}

function performWork(deadline) {
  workLoop(deadline);
  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork);
  }
}

function workLoop(deadline) {
  if (!nextUnitOfWork) {
    resetNextUnitOfWork();
  }
  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
}

function resetNextUnitOfWork() {
  const update = updateQueue.shift();
  if (!update) {
    return;
  }

  // Copy the setState parameter from the update payload to the corresponding fiber
  if (update.partialState) {
    update.instance.__fiber.partialState = update.partialState;
  }
  const oldFiberTreeRoot =
    update.from === HOST_ROOT
      ? update.dom._rootContainerFiber
      : getRoot(update.instance.__fiber);
  nextUnitOfWork = {
    tag: HOST_ROOT,
    stateNode: update.dom || oldFiberTreeRoot.stateNode,
    props: update.newProps || oldFiberTreeRoot.props,
    alternate: oldFiberTreeRoot
  };
}

function getRoot(fiber) {
  let node = fiber;
  while (node.parent) {
    node = node.parent;
  }

  return node;
}

function performUnitOfWork(workInProgressFiber) {
  beginWork(workInProgressFiber);
  if (workInProgressFiber.child) {
    return workInProgressFiber.child;
  }

  // No child, we call completeWork until we find a sibling
  let uow = workInProgressFiber;
  while (uow) {
    completeWork(uow);
    if (uow.sibling) {
      // Sibling needs to beginWork
      return uow.sibling;
    }
    uow = uow.parent;
  }
}

function beginWork(workInProgressFiber) {
  if (workInProgressFiber.tag === CLASS_COMPONENT) {
    updateClassComponent(workInProgressFiber);
  } else {
    updateHostComponent(workInProgressFiber);
  }
}

function updateHostComponent(workInProgressFiber) {
  if (!workInProgressFiber.stateNode) {
    workInProgressFiber.stateNode = createDomElement(workInProgressFiber);
  }

  const newChildElements = workInProgressFiber.props.children;
  reconcileChildrenArray(workInProgressFiber, newChildElements);
}

function updateClassComponent(workInProgressFiber) {
  let instance = workInProgressFiber.stateNode;
  if (instance == null) {
    // Call class constructor
    instance = workInProgressFiber.stateNode = createInstance(workInProgressFiber);
  } else if (workInProgressFiber.props === instance.props && !workInProgressFiber.partialState) {
    // No need to render, clone children from last time
    cloneChildFibers(workInProgressFiber);
    return;
  }

  instance.props = workInProgressFiber.props;
  instance.state = { ...instance.state, ...workInProgressFiber.partialState };
  workInProgressFiber.partialState = null;

  const newChildElements = workInProgressFiber.stateNode.render();
  reconcileChildrenArray(workInProgressFiber, newChildElements);
}

function reconcileChildrenArray(workInProgressFiber, newChildElements) {
  const elements = [].concat(newChildElements);
  let index = 0;
  let oldFiber = workInProgressFiber.alternate ? workInProgressFiber.alternate.child : null;
  let newFiber = null;
  while (index < elements.length || oldFiber != null) {
    const prevFiber = newFiber;
    const element = index < elements.length && elements[index];
    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        tag: oldFiber.tag,
        stateNode: oldFiber.stateNode,
        props: element.props,
        parent: workInProgressFiber,
        alternate: oldFiber,
        partialState: oldFiber.partialState,
        effectTag: UPDATE
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        tag: typeof element.type === "string" ? HOST_COMPONENT : CLASS_COMPONENT,
        props: element.props,
        parent: workInProgressFiber,
        effectTag: PLACEMENT
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = DELETION;
      workInProgressFiber.effects = workInProgressFiber.effects || [];
      workInProgressFiber.effects.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      workInProgressFiber.child = newFiber;
    } else if (prevFiber && element) {
      prevFiber.sibling = newFiber;
    }

    index++;
  }
}

function cloneChildFibers(parentFiber) {
  const oldFiber = parentFiber.alternate;
  if (!oldFiber.child) {
    return;
  }

  let oldChild = oldFiber.child;
  let prevChild = null;
  while (oldChild) {
    const newChild = {
      type: oldChild.type,
      tag: oldChild.tag,
      stateNode: oldChild.stateNode,
      props: oldChild.props,
      partialState: oldChild.partialState,
      alternate: oldChild,
      parent: parentFiber
    };
    if (prevChild) {
      prevChild.sibling = newChild;
    } else {
      parentFiber.child = newChild;
    }
    prevChild = newChild;
    oldChild = oldChild.sibling;
  }
}

function completeWork(fiber) {
  if (fiber.tag === CLASS_COMPONENT) {
    fiber.stateNode.__fiber = fiber;
  }

  if (fiber.parent) {
    const childEffects = fiber.effects || [];
    const thisEffect = fiber.effectTag != null ? [fiber] : [];
    const parentEffects = fiber.parent.effects || [];
    fiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
  } else {
    pendingCommit = fiber;
  }
}

function commitAllWork(fiber) {
  fiber.effects.forEach(f => {
    commitWork(f);
  });
  fiber.stateNode._rootContainerFiber = fiber;
  nextUnitOfWork = null;
  pendingCommit = null;
}

function commitWork(fiber) {
  if (fiber.tag === HOST_ROOT) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (domParentFiber.tag === CLASS_COMPONENT) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.stateNode;

  if (fiber.effectTag === PLACEMENT && fiber.tag === HOST_COMPONENT) {
    domParent.appendChild(fiber.stateNode);
  } else if (fiber.effectTag === UPDATE) {
    updateDomElementProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === DELETION) {
    commitDeletion(fiber, domParent);
  }
}

function commitDeletion(fiber, domParent) {
  let node = fiber;
  while (true) {
    if (node.tag === CLASS_COMPONENT) {
      node = node.child;
      continue;
    }
    domParent.removeChild(node.stateNode);
    while (node !== fiber && !node.sibling) {
      node = node.parent;
    }
    if (node === fiber) {
      return;
    }
    node = node.sibling;
  }
}

export { scheduleUpdate, render };