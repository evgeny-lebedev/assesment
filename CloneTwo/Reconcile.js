import { createInstance } from "./CreateInstance";
import { updateDomElementProperties } from "./DomUtils";

const isComponent = element => typeof element.type === "function";

function reconcile(container, instance, element) {
  if (instance == null && element == null){
    return null;
  }

  if (instance == null) {
    // Create instance
    const newInstance = createInstance(element);

    container.appendChild(newInstance.domElement);

    if (isComponent(element)) {
      newInstance.componentInstance.componentDidMount();
    }

    return newInstance;
  } else if (element == null) {
    // Remove instance

    if (isComponent(instance.element)) {
      instance.componentInstance.componentWillUnmount();
    }

    container.removeChild(instance.domElement);

    return null;
  } else if (instance.element.type !== element.type) {
    // Replace instance
    const newInstance = createInstance(element);

    if (isComponent(element)) {
      newInstance.componentInstance.componentWillUnmount();
    }

    container.removeChild(instance.domElement);

    container.appendChild(newInstance.domElement);

    if (isComponent(element)) {
      newInstance.componentInstance.componentDidMount()
    }

    // container.replaceChild(newInstance.domElement, instance.domElement);

    return newInstance;
  } else if (isComponent(element)) {
    //Update composite instance
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

    return instance;

  } else {
    // Update instance
    updateDomElementProperties(instance.domElement, instance.element.props, element.props);

    instance.childInstances = reconcileChildren(instance, element);

    instance.element = element;

    return instance;
  }
}

function reconcileChildren(instance, element) {
  const childInstances = instance.childInstances;

  const nextChildElements = element.props.children || [];

  const newChildInstances = [];

  const count = Math.max(childInstances.length, nextChildElements.length);

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];

    const childElement = nextChildElements[i];

    const newChildInstance = reconcile(instance.domElement, childInstance, childElement);

    newChildInstances.push(newChildInstance);
  }

  return newChildInstances.filter(instance => instance != null);
}

export { reconcile };