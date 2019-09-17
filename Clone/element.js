import { TEXT_ELEMENT, WARNING_TYPES } from "./constants";
import { hasElementsKeys, filterValid, checkKeys, showWarning } from "./utils";

function createElement(type, config, ...args) {
  const props = { ...config };

  validateArgs(args);

  const rawChildren = filterValid([...args]);

  props.children = rawChildren.map(child => child instanceof Object ? child : createTextElement(child));

  return { type, props };
}

function validateArgs(args) {
  const arrays = args.filter(arg => Array.isArray(arg));

  arrays.forEach((array) => {
    const arrayHasKeys = hasElementsKeys(filterValid(array));

    if (!arrayHasKeys) {
      array.forEach((element, index) => element.props = { ...element.props, key: index });

      showWarning(WARNING_TYPES.noKeys);
    } else {
      checkKeys(array)
    }
  });
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

export { createElement };