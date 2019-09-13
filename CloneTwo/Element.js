import { TEXT_ELEMENT } from "./Constants";

function createElement(type, config, ...args) {
  const props = { ...config };

  const rawChildren = [].concat(...args);

  const filteredChildren = rawChildren.filter(child => child);

  props.children = filteredChildren.map(child => child instanceof Object ? child : createTextElement(child));

  return { type, props };
}

function createTextElement(value) {

  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

export { createElement };