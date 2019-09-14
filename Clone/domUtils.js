import { TEXT_ELEMENT } from "./constants";
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

export { updateDomElementProperties, createDomElement };