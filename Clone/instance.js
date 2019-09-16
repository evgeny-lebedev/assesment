import { createDomElement } from "./domUtils";
import { filterValid, isElementComponent, isInstanceTypeArray, isValid } from "./utils";
import { ARRAY, KEY } from "./constants";

function createInstance(element) {
  if (!isValid(element)) {
    return null;
  }

  if (Array.isArray(element)) {
    return createArrayInstance(element)
  } else if (isElementComponent(element)) {
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
    const instance = { domElement, element, childInstances };

    filterValid(childInstances).forEach((childInstance, index) => {
      if (isInstanceTypeArray(childInstance)) {
        const filtered = filterValid(childInstance.instances);

        filtered.forEach(instance => {
          if (instance.element.props.hasOwnProperty(KEY)) {
            instance.key = instance.element.props.key;
          } else {
            instance.key = index;
          }

          domElement.appendChild(instance.domElement);
        });

        childInstance.key = index;
      } else {
        childInstance.key = index;

        domElement.appendChild(childInstance.domElement);
      }

      if (childInstance.componentInstance) {
        childInstance.componentInstance.componentDidMount();
      }
    });

    if (element.props.key){
      instance.key = element.props.key;
    }

    return instance;
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