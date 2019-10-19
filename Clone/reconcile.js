import { createInstance } from "./instance";
import { performDomUpdate, updateDomElementProperties } from "./domUtils";
import {
  filterValid, getElementByKey, getInstanceByKey,
  isElementComponent,
  isEqual,
  isInstanceOfPureComponent,
  isValid,
} from "./utils";
import { DOM_CHANGES_TYPES } from "./constants";

function reconcile(container, instance, element, forceUpdate) {
  const noInstanceAndElement = !instance && !element;
  const noInstance = !instance;
  const noElement = !element;
  const differentTypes = noInstance || noElement || instance.element.type !== element.type;
  const isComponent = isElementComponent(element);

  if (noInstanceAndElement) {
    return null;
  }

  if (noInstance) {
    return instantiate(container, instance, element)
  }

  if (noElement) {
    return remove(container, instance)
  }

  if (differentTypes) {
    return replace(container, instance, element)
  }

  if (isComponent) {
    return updateComponent(container, instance, element, forceUpdate)
  }

  return update(container, instance, element)
}

function instantiate(container, instance, element, prepend, insertAfter) {
  const newInstance = createInstance(element);

  if (!isValid(newInstance)) {
    return null;
  }

  if (prepend) {
    performDomUpdate(DOM_CHANGES_TYPES.prepend, container, newInstance.domElement);
  } else if (insertAfter) {
    performDomUpdate(DOM_CHANGES_TYPES.insertAfter, insertAfter, newInstance.domElement);
  } else {
    performDomUpdate(DOM_CHANGES_TYPES.append, container, newInstance.domElement);
  }

  if (isElementComponent(element)) {
    newInstance.componentInstance.componentDidMount();
  }

  return newInstance;
}

function remove(container, instance) {
  if (isElementComponent(instance.element)) {
    instance.componentInstance.componentWillUnmount();
  }

  performDomUpdate(DOM_CHANGES_TYPES.remove, container, instance.domElement);

  return null;
}

function replace(container, instance, element) {
  const newInstance = createInstance(element);

  if (isElementComponent(element)) {
    newInstance.componentInstance.componentWillUnmount();
  }

  performDomUpdate(DOM_CHANGES_TYPES.replace, container, instance.domElement, newInstance.domElement);

  if (isElementComponent(element)) {
    newInstance.componentInstance.componentDidMount()
  }

  return newInstance;
}

function updateComponent(container, instance, element, forceUpdate) {
  const instanceOfPureComponent = isInstanceOfPureComponent(instance.componentInstance);
  const shouldUpdate = forceUpdate || instanceOfPureComponent
    ? instance.componentInstance.shouldComponentUpdate(instance.componentInstance.props, element.props)
    : instance.componentInstance.shouldComponentUpdate();

  if (shouldUpdate) {
    instance.componentInstance.props = element.props;

    const childElement = instance.componentInstance.render();
    const oldChildInstance = instance.childInstance;
    const newChildInstance = reconcile(container, oldChildInstance, childElement);

    instance.domElement = newChildInstance.domElement;

    instance.childInstance = newChildInstance;

    instance.element = element;

    instance.componentInstance.componentDidUpdate();
  }

  return instance;
}

function update(container, instance, element) {
  updateDomElementProperties(instance.domElement, instance.element.props, element.props);

  instance.childInstances = reconcileChildren(instance, element);

  instance.element = element;

  return instance;
}

function reconcileArray(parentInstance, instance, elements) {
  const key = instance.key;
  const oldInstances = instance.instances;
  const newInstances = [];

  if (oldInstances.length > elements.length) {
    oldInstances.forEach((childInstance) => {
      const childElement = getElementByKey(elements, childInstance.key);
      const newChildInstance = reconcile(parentInstance.domElement, childInstance, childElement);

      newInstances.push(newChildInstance);
    })
  } else {
    elements.forEach((childElement) => {
      const key = childElement.props.key;
      const childInstance = getInstanceByKey(oldInstances, key);
      if (!childInstance) {
        reconcileNewArrayInstance(parentInstance, instance, childElement, newInstances);
      } else {
        const newChildInstance = reconcile(parentInstance.domElement, childInstance, childElement);

        newInstances.push(newChildInstance);
      }
    });
  }

  const filteredInstances = filterValid(newInstances);

  return { instances: filteredInstances, key };
}

function reconcileNewArrayInstance(parentInstance, instance, childElement, newInstances) {
  const oldInstances = instance.instances;
  let newChildInstance = null;

  if (oldInstances.length > 0) {
    const insertAfter = oldInstances[oldInstances.length - 1].domElement;

    newChildInstance = instantiate(parentInstance.domElement, null, childElement, false, insertAfter);
  } else {
    if (parentInstance.childInstances.length > 0) {
      const instanceIndex = parentInstance.childInstances.findIndex(childInstance => childInstance.key === instance.key);

      if (instanceIndex === 0) {
        newChildInstance = instantiate(parentInstance.domElement, null, childElement, true);
      } else if (instanceIndex === parentInstance.childInstances.length - 1) {
        newChildInstance = instantiate(parentInstance.domElement, null, childElement);
      } else {
        const insertAfter = parentInstance.childInstances[instanceIndex - 1].domElement;
        newChildInstance = instantiate(parentInstance.domElement, null, childElement, false, insertAfter);
      }
    } else {
      newChildInstance = instantiate(parentInstance.domElement, null, childElement);
    }
  }

  newInstances.push(newChildInstance);
}

function reconcileChildren(instance, element) {
  const instances = instance.childInstances;
  const elements = element.props.children || [];
  const newInstances = [];

  elements.forEach((element, childElementIndex) => {
    if (Array.isArray(element)) {
      const newInstance = reconcileArray(instance, instances[childElementIndex], filterValid(element));

      newInstances.push(newInstance);

    } else {
      const key = element.props.key || childElementIndex;
      const childInstance = instances[key];
      const newChildInstance = reconcile(instance.domElement, childInstance, element);

      newInstances.push(newChildInstance);
    }
  });

  return filterValid(newInstances);
}

function updateCompositeInstance(componentInstance, partialState) {
  const statesEqual = isEqual(componentInstance.state, partialState);
  const instanceOfPureComponent = isInstanceOfPureComponent(componentInstance);
  const shouldUpdate = instanceOfPureComponent
    ? true
    : componentInstance.shouldComponentUpdate();

  if (!shouldUpdate || statesEqual) {
    return;
  }

  componentInstance.state = { ...componentInstance.state, ...partialState };

  const parentDom = componentInstance.instance.domElement.parentNode;
  const element = componentInstance.instance.element;

  reconcile(parentDom, componentInstance.instance, element);
}

function forceUpdateCompositeInstance(componentInstance) {
  const parentDom = componentInstance.instance.domElement.parentNode;
  const element = componentInstance.instance.element;

  reconcile(parentDom, componentInstance.instance, element, true);
}

export { reconcile, updateCompositeInstance, forceUpdateCompositeInstance };