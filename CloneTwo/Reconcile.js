import { createInstance } from "./CreateInstance";
import { updateDomElementProperties } from "./DomUtils";

function reconcile(container, instance, element) {
  if (instance == null) {
    // Create instance
    const newInstance = createInstance(element);
    container.appendChild(newInstance.domElement);
    return newInstance;
  } else if (element == null) {
    // Remove instance
    container.removeChild(instance.domElement);
    return null;
  } else if (instance.element.type !== element.type) {
    // Replace instance
    const newInstance = createInstance(element);
    container.replaceChild(newInstance.domElement, instance.domElement);
    return newInstance;
  } else if (typeof element.type === "string") {
    // Update instance
    updateDomElementProperties(instance.domElement, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {

    //Update composite instance
    instance.componentInstance.props = element.props;
    const childElement = instance.componentInstance.render();
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(
      container,
      oldChildInstance,
      childElement
    );
    instance.domElement = childInstance.domElement;
    instance.childInstance = childInstance;
    instance.element = element;
    return instance;
  }
}

function reconcileChildren(instance, element) {
  const instanceDomElement = instance.domElement;

  const childInstances = instance.childInstances;

  const nextChildElements = element.props.children || [];

  const newChildInstances = [];

  const count = Math.max(childInstances.length, nextChildElements.length);

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];

    const childElement = nextChildElements[i];

    const newChildInstance = reconcile(instanceDomElement, childInstance, childElement);

    newChildInstances.push(newChildInstance);
  }

  return newChildInstances.filter(instance => instance != null);
}

export { reconcile };