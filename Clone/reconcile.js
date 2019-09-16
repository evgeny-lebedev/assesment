import { createInstance } from "./instance";
import { insertDomElement, updateDomElementProperties } from "./domUtils";
import {
  areKeysValid,
  filterValid, getElementByKey, getInstanceByKey,
  isElementComponent,
  isEqual,
  isInstanceOfPureComponent, isInstanceTypeArray,
  isValid,
} from "./utils";
import { INSERTION_TYPES } from "./constants";

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
    insertDomElement(INSERTION_TYPES.prepend, container, newInstance.domElement);
  } else if (insertAfter) {
    insertDomElement(INSERTION_TYPES.insertAfter, insertAfter, newInstance.domElement);

  } else {
    insertDomElement(INSERTION_TYPES.append, container, newInstance.domElement);
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

  insertDomElement(INSERTION_TYPES.remove, container, instance.domElement);

  return null;
}

function replace(container, instance, element) {
  const newInstance = createInstance(element);

  if (isElementComponent(element)) {
    newInstance.componentInstance.componentWillUnmount();
  }

  insertDomElement(INSERTION_TYPES.replace, container, instance.domElement, newInstance.domElement);

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
    const newChildInstance = reconcile(
      container,
      oldChildInstance,
      childElement
    );

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
  const oldInstances = instance.instances;
  const newInstances = [];
  const newInstance = {
    key: instance.key,
  };
  if (oldInstances.length > elements.length) {
    oldInstances.forEach((childInstance) => {
      if (isInstanceTypeArray(childInstance)) {
        const neededElements = getElementByKey(elements, childInstance.key);

        reconcileArray(parentInstance, childInstance, neededElements)
      } else {
        const childElement = getElementByKey(elements, childInstance.key);
        const newChildInstance = reconcile(parentInstance.domElement, childInstance, childElement);

        newInstances.push(newChildInstance);
      }
    })
  } else {
    elements.forEach((childElement, childElementIndex) => {
      if (Array.isArray(childElement)) {
        const neededInstances = getInstanceByKey(oldInstances, childElement.props.key);

        reconcileArray(parentInstance, neededInstances, filterValid(childElement))
      } else {
        const key = childElement.props.key || childElementIndex;
        const childInstance = getInstanceByKey(oldInstances, key);

        if (!childInstance) {
          reconcileNewArrayInstance(instance, parentInstance, childElement, newInstances)
        } else {
          const newChildInstance = reconcile(parentInstance.domElement, childInstance, childElement);

          newInstances.push(newChildInstance);
        }

      }
    });
  }

  newInstance.instances = filterValid(newInstances);

  return newInstance;
}

function reconcileNewArrayInstance(instance, parentInstance, childElement, newInstances) {
  const oldInstances = instance.instances;

  if (oldInstances.length > 0) {
    const insertAfter = oldInstances[oldInstances.length - 1].domElement;
    const newChildInstance = instantiate(parentInstance.domElement, null, childElement, false, insertAfter);

    newInstances.push(newChildInstance);
  } else {
    if (parentInstance.childInstances.length > 0) {
      const instanceIndex = parentInstance.childInstances.findIndex(x => x.key === instance.key);

      if (instanceIndex === 0) {
        const newChildInstance = instantiate(parentInstance.domElement, null, childElement, true);

        newInstances.push(newChildInstance);
      } else if (instanceIndex === parentInstance.childInstances.length - 1) {
        const newChildInstance = instantiate(parentInstance.domElement, null, childElement);

        newInstances.push(newChildInstance);
      } else {
        const insertAfter = parentInstance.childInstances[instanceIndex - 1].domElement;
        const newChildInstance = instantiate(parentInstance.domElement, null, childElement, false, insertAfter);

        newInstances.push(newChildInstance);
      }
    } else {
      const newChildInstance = instantiate(parentInstance.domElement, null, childElement);

      newInstances.push(newChildInstance);
    }
  }
}

function reconcileChildren(instance, element) {
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = [];

  if (childInstances.length > nextChildElements.length) {
    childInstances.forEach((childInstance) => {
      const childElement = getElementByKey(nextChildElements, childInstance.key);
      const newChildInstance = reconcile(instance.domElement, childInstance, childElement);

      newChildInstances.push(newChildInstance);
    })
  } else {
    nextChildElements.forEach((childElement, childElementIndex) => {
      if (Array.isArray(childElement)) {
        const justNew = reconcileArray(instance, childInstances[childElementIndex], filterValid(childElement));

        newChildInstances.push(justNew);

      } else {
        const key = childElement.props.key || childElementIndex;
        const childInstance = childInstances[key];
        const newChildInstance = reconcile(instance.domElement, childInstance, childElement);

        newChildInstances.push(newChildInstance);
      }
    });
  }
  const filteredChildInstances = filterValid(newChildInstances);

  areKeysValid(filteredChildInstances);

  return filterValid(newChildInstances);
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

  componentInstance.state = Object.assign({}, componentInstance.state, partialState);

  const parentDom = componentInstance.instance.domElement.parentNode;
  const element = componentInstance.instance.element;

  reconcile(parentDom, componentInstance.instance, element, true);
}

function forceUpdateCompositeInstance(componentInstance) {
  const parentDom = componentInstance.instance.domElement.parentNode;
  const element = componentInstance.instance.element;

  reconcile(parentDom, componentInstance.instance, element, true);
}

export { reconcile, updateCompositeInstance, forceUpdateCompositeInstance };