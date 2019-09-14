import { ERROR_TYPES, TEXT_ELEMENT } from "./constants";
import { elementsHasKeys, errorToConsole, filterValid } from "./utils";

function createElement(type, config, ...args) {
  const props = { ...config };
  const arrays = args.filter(arg => Array.isArray(arg));

  arrays.forEach(array => {
    return elementsHasKeys(filterValid(array)) || errorToConsole(ERROR_TYPES.noKeys)
  });

  const rawChildren = [].concat(...args);

  props.children = filterValid(rawChildren).map(child => child instanceof Object ? child : createTextElement(child));

  return { type, props };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

export { createElement };