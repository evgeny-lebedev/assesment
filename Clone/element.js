import { ERROR_TYPES, TEXT_ELEMENT } from "./constants";
import { hasElementsKeys, errorToConsole, filterValid } from "./utils";

function createElement(type, config, ...args) {
  const props = { ...config };

  validateArgs(args);

  const rawChildren = filterValid([...args]);

  props.children = rawChildren.map(child => child instanceof Object ? child : createTextElement(child));

  return { type, props };
}

function validateArgs(args) {
  const arrays = args.filter(arg => Array.isArray(arg));

  arrays.forEach(array => {
    const arrayHasKeys = hasElementsKeys(filterValid(array));

    if (!arrayHasKeys) {
      array.forEach((element, index) => element.props = { ...element.props, key: index });

      errorToConsole(ERROR_TYPES.noKeys);
    }
  });
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

export { createElement };