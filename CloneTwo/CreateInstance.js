import { createDomElement } from "./DomUtils";
import { reconcile } from "./Reconcile";

function createInstance(element) {
  if (element == null) {
    return null;
  }

  const isComponent = typeof element.type === "function";

  if (isComponent) {

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

    const filteredChildInstances = childInstances.filter(childInstance => childInstance !== null);

    filteredChildInstances.forEach(childInstance => {

      domElement.appendChild(childInstance.domElement);

      if (childInstance.componentInstance) {
        childInstance.componentInstance.componentDidMount();
      }
    });

    const instance = { domElement, element, childInstances };

    return instance;
  }
}

function createComponentInstance(element, instance) {
  const { type, props } = element;

  const componentInstance = new type(props);

  componentInstance.instance = instance;

  return componentInstance;
}

function updateInstance(instance) {
  const parentDom = instance.domElement.parentNode;

  const element = instance.element;

  reconcile(parentDom, instance, element);
}

function useState(initialValue) {

  let state = initialValue;

  function getState() {
    return state;
  }

  function setStage(newValue) {
    state = newValue;
  }

  return [getState, setStage];
}

export { createInstance, useState, updateInstance };