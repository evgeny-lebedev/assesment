import { createInstance } from "./Instance";
import { updateDomElementProperties } from "./DomUtils";
import { filterValid, isElementComponent, isEqual, isInstanceOfPureComponent, isValid } from "./Utils";

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
    return updateComposite(container, instance, element, forceUpdate)
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

function updateComposite(container, instance, element, forceUpdate) {
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

  const longest = childInstances.length > nextChildElements.length
    ? childInstances
    : nextChildElements;

  longest.forEach((item, index) => {
    const childInstance = childInstances[index];

    const childElement = nextChildElements[index];

    const newChildInstance = reconcile(instance.domElement, childInstance, childElement);

    newChildInstances.push(newChildInstance);
  });

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