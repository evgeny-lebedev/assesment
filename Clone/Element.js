import { TEXT_ELEMENT } from "./Constants";

function createElement(type, config, ...args) {
  const props = { ...config };

  const children = args.length > 0 ? [].concat(...args) : [];

  const filteredChildren = children.filter(child => child != null && child !== false);

  props.children = filteredChildren.map(
    child => child instanceof Object ? child : createTextElement(child));

  return { type, props };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

export { createElement }