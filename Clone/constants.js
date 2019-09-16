const TEXT_ELEMENT = "TEXT ELEMENT";
const ON = "on";
const CHILDREN = "children";
const STYLE = "style";
const FUNCTION = "function";
const KEY = "key";
const BOOLEAN = "boolean";
const ARRAY = "array";

const ERROR_TYPES = {
  noKeys: "noKeys",
  invalidElement: "invalidElement",
  invalidContainer: "invalidContainer",
  invalidKeys: "invalidKeys",
};

const ERROR_MESSAGES = {
  [ERROR_TYPES.noKeys]: "Each item of array should have a \"key\" property for better performance",
  [ERROR_TYPES.invalidElement]: "You must pass a valid element to \"render\" function as a first argument",
  [ERROR_TYPES.invalidContainer]: "You must pass a valid container to \"render\" function as a second argument",
  [ERROR_TYPES.invalidKeys]: "Invalid keys provided",
};

const INSERTION_TYPES = {
  prepend: "prepend",
  append: "append",
  insertBefore: "insertBefore",
  insertAfter: "insertAfter",
  replace: "replace",
  remove: "remove",
};

export { ERROR_TYPES, ERROR_MESSAGES, INSERTION_TYPES, TEXT_ELEMENT, ON, CHILDREN, STYLE, FUNCTION, KEY, BOOLEAN, ARRAY };