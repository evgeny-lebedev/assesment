import { INSERTION_TYPES, TEXT_ELEMENT } from "./constants";
import { isPropAttribute, isPropEvent, isPropGone, isPropNew } from "./utils";

function updateDomElementProperties(domElement, prevProps, nextProps) {
  updateEventListeners(domElement, prevProps, nextProps);

  updateAttributes(domElement, prevProps, nextProps);

  updateStyle(domElement, prevProps, nextProps)
}

function updateEventListeners(domElement, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(isPropEvent)
    .filter(key => isPropGone(prevProps, nextProps)(key) || isPropNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);

      domElement.removeEventListener(eventType, prevProps[name]);
    });

  Object.keys(nextProps)
    .filter(isPropEvent)
    .filter(isPropNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);

      domElement.addEventListener(eventType, nextProps[name]);
    });
}

function updateAttributes(domElement, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(isPropAttribute)
    .filter(isPropGone(prevProps, nextProps))
    .forEach(name => {
      delete domElement[name];
    });

  Object.keys(nextProps)
    .filter(isPropAttribute)
    .filter(isPropNew(prevProps, nextProps))
    .forEach(name => {
      domElement[name] = nextProps[name];
    });
}

function updateStyle(domElement, prevProps, nextProps) {
  const prevStyle = prevProps.style || {};
  const nextStyle = nextProps.style || {};

  Object.keys(prevStyle)
    .filter(isPropGone(prevStyle, nextStyle))
    .forEach(key => {
      domElement.style[key] = "";
    });

  Object.keys(nextStyle)
    .filter(isPropNew(prevStyle, nextStyle))
    .forEach(key => {
      domElement.style[key] = nextStyle[key];
    });
}

function createDomElement(element) {
  const isTextElement = element.type === TEXT_ELEMENT;
  const domElement = isTextElement
    ? document.createTextNode(element.props.nodeValue)
    : document.createElement(element.type);

  if (!isTextElement) {
    updateDomElementProperties(domElement, [], element.props);
  }

  return domElement;
}

function prependDomElement(container, element) {
    container.prepend(element)
}

function appendDomElement(container, element) {
    container.append(element)
}

function insertDomElementBefore(container, element) {
    container.before(element)
}

function insertDomElementAfter(container, element) {
    container.after(element)
}

// todo: replaceWith

function replaceDomElement(container, element, newElement) {
    container.removeChild(instance.domElement);

    container.appendChild(newElement);
}

function removeDomElement(container, element) {
    container.removeChild(element)
}

function insertDomElement(insertionType, container, domElement, newDomElement) {
  switch (insertionType) {
    case INSERTION_TYPES.prepend:
      prependDomElement(container, domElement);
      break;
    case INSERTION_TYPES.append:
      appendDomElement(container, domElement);
      break;
    case INSERTION_TYPES.insertBefore:
      insertDomElementBefore(container, domElement);
      break;
    case INSERTION_TYPES.insertAfter:
      insertDomElementAfter(container, domElement);
      break;
    case INSERTION_TYPES.replace:
      replaceDomElement(container, domElement, newDomElement);
      break;
    case INSERTION_TYPES.remove:
      removeDomElement(container, domElement);
      break;
  }
}

export { updateDomElementProperties, createDomElement, insertDomElement };