import { createDomElement } from "./DomUtils";
import { reconcile } from "./Reconcile";

function createInstance(element) {
  const isDomElement = typeof element.type === "string";

  if (isDomElement) {
    // Create DOM element
    const domElement = createDomElement(element);

    // Instantiate and append children

    const childElements = element.props.children || [];

    const childInstances = childElements.map(createInstance);

    childInstances.forEach(childInstance => domElement.appendChild(childInstance.domElement));

    const instance = { domElement, element, childInstances };

    return instance;
  } else {

    // Instantiate component element
    const instance = {};

    const componentInstance = createComponentInstance(element, instance);

    const childElement = componentInstance.render();

    const childInstance = createInstance(childElement);

    const domElement = childInstance.domElement;

    Object.assign(instance, { domElement, element, childInstance, componentInstance });

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