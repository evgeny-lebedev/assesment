import { createInstance } from "./instance";
import { updateDomElementProperties } from "./domUtils";
import {
  areKeysValid,
  filterValid, getElementByKey,
  isElementComponent,
  isEqual,
  isInstanceOfPureComponent,
  isValid,
} from "./utils";

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
    return remove(container, instance, element)
  }

  if (differentTypes) {
    return replace(container, instance, element)
  }

  if (isComponent) {
    return updateComponent(container, instance, element, forceUpdate)
  }

  return update(container, instance, element)
}

function instantiate(container, instance, element) {
  const newInstance = createInstance(element);

  if (!isValid(newInstance)) {
    return null;
  }

  container.appendChild(newInstance.domElement);

  if (isElementComponent(element)) {
    newInstance.componentInstance.componentDidMount();
  }

  return newInstance;
}

function remove(container, instance) {
  if (isElementComponent(instance.element)) {
    instance.componentInstance.componentWillUnmount();
  }

  container.removeChild(instance.domElement);

  return null;
}

function replace(container, instance, element) {
  const newInstance = createInstance(element);

  if (isElementComponent(element)) {
    newInstance.componentInstance.componentWillUnmount();
  }

  container.removeChild(instance.domElement);

  container.appendChild(newInstance.domElement);

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
    nextChildElements.forEach((childElement, index) => {
      const key = childElement.props.key || index;
      const childInstance = childInstances[key];
      const newChildInstance = reconcile(instance.domElement, childInstance, childElement);

      newChildInstances.push(newChildInstance);
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