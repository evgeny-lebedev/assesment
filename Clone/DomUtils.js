import { CHILDREN, ON, STYLE, TEXT_ELEMENT } from "./Constants";

const isEvent = name => name.startsWith(ON);
const isAttribute = name => !isEvent(name) && name !== CHILDREN && name !== STYLE;
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

function updateDomProperties(dom, prevProps, nextProps) {
  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => isGone(prevProps, nextProps)(key) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });

  // Remove attributes
  Object.keys(prevProps)
    .filter(isAttribute)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      delete dom[name];
    });

  // Set attributes
  Object.keys(nextProps)
    .filter(isAttribute)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // Style
  const prevStyle = prevProps.style || {};
  const nextStyle = nextProps.style || {};

  // Remove style
  Object.keys(prevStyle)
    .filter(isGone(prevStyle, nextStyle))
    .forEach(key => {
      dom.style[key] = "";
    });

  //Set style
  Object.keys(nextStyle)
    .filter(isNew(prevStyle, nextStyle))
    .forEach(key => {
      dom.style[key] = nextStyle[key];
    });

}

function createDomElement(fiber) {
  const isTextElement = fiber.type === TEXT_ELEMENT;
  const domElement = isTextElement
    ? document.createTextNode(fiber.props.nodeValue)
    : document.createElement(fiber.type);
  isTextElement || updateDomProperties(domElement, [], fiber.props);

  return domElement;
}

export { updateDomProperties, createDomElement };