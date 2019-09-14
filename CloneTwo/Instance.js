import { createDomElement } from "./DomUtils";
import { filterValid, isElementComponent, isValid } from "./Utils";

function createInstance(element) {
  if (!isValid(element)) {
    return null;
  }

  if (isElementComponent(element)) {
    const instance = {};

    const componentInstance = createComponentInstance(element, instance);

    const childElement = componentInstance.render();

    const childInstance = createInstance(childElement);

    if (childInstance == null) {
      return null;
    }

    const domElement = childInstance.domElement;

    Object.assign(instance, { domElement, element, childInstance, componentInstance });

    return instance;
  } else {
    const domElement = createDomElement(element);

    const childElements = element.props.children || [];

    const childInstances = childElements.map(createInstance);

    filterValid(childInstances).forEach((childInstance, index) => {
      if (childInstance.element.props.hasOwnProperty("key")) {
        childInstance.key = childInstance.element.props.key;
      } else {
        childInstance.key = index;
      }

      domElement.appendChild(childInstance.domElement);

      if (childInstance.componentInstance) {
        childInstance.componentInstance.componentDidMount();
      }
    });

    return { domElement, element, childInstances };
  }
}

function createComponentInstance(element, instance) {
  const { type, props } = element;

  const componentInstance = new type(props);

  componentInstance.instance = instance;

  return componentInstance;
}

export { createInstance };