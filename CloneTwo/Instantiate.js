import { createDomElement } from "./DomUtils";

function instantiate(element) {
  // Create DOM element

  const dom = createDomElement(element);

  // Instantiate and append children
  const childElements = element.props.children || [];
  const childInstances = childElements.map(instantiate);
  const childDoms = childInstances.map(childInstance => childInstance.dom);
  childDoms.forEach(childDom => dom.appendChild(childDom));

  const instance = { dom, element, childInstances };

  return instance;
}

export { instantiate };