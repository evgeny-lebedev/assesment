import { createDomElement, performDomChanges } from "./domUtils";
import { filterValid, isElementComponent, isInstanceArrayType, isValid } from "./utils";
import { ARRAY, DOM_CHANGES_TYPES, KEY } from "./constants";

function createInstance(element) {
  if (!isValid(element)) {
    return null;
  }

  if (Array.isArray(element)) {
    return createArrayInstance(element)
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

    if (element.props.key) {
      instance.key = element.props.key;
    }

    return instance;
  } else {
    const domElement = createDomElement(element);
    const childElements = element.props.children || [];
    const childInstances = childElements.map(createInstance);
    const instance = { domElement, element, childInstances };
    const handleChildInstance = getHandleChildInstance(domElement);

    filterValid(childInstances).forEach(handleChildInstance);

    if (element.props.key) {
      instance.key = element.props.key;
    }

    return instance;
  }
}

function getHandleChildInstance(container) {
  return function (childInstance, index) {
    if (isInstanceArrayType(childInstance)) {
      const filtered = filterValid(childInstance.instances);

      filtered.forEach(instance => {
        if (instance.element.props.hasOwnProperty(KEY)) {
          instance.key = instance.element.props.key;
        } else {
          instance.key = index;
        }

        performDomChanges(DOM_CHANGES_TYPES.append, container, instance.domElement);
      });

      childInstance.key = index;
    } else {
      childInstance.key = index;

      performDomChanges(DOM_CHANGES_TYPES.append, container, childInstance.domElement);
    }

    if (childInstance.componentInstance) {
      childInstance.componentInstance.componentDidMount();
    }
  }
}

function createArrayInstance(elements) {
  const instances = elements.map(element => createInstance(element));

  return {
    instances: filterValid(instances),
    type: ARRAY,
  };
}

function createComponentInstance(element, instance) {
  const { type, props } = element;
  const componentInstance = new type(props);

  componentInstance.instance = instance;

  return componentInstance;
}

export { createInstance };