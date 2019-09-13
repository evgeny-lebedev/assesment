import { TEXT_ELEMENT } from "./Constants";
import { filterValid } from "./Utils";

function createElement(type, config, ...args) {
  const props = { ...config };

  const rawChildren = [].concat(...args);

  props.children = filterValid(rawChildren).map(child => child instanceof Object ? child : createTextElement(child));

  return { type, props };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

export { createElement };