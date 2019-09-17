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
  duplicateKeys: "duplicateKeys",
};

const ERROR_MESSAGES = {
  [ERROR_TYPES.noKeys]: "Warning: Each child in a list should have a unique \"key\" prop",
  [ERROR_TYPES.invalidElement]: "You must pass a valid element to \"render\" function as a first argument",
  [ERROR_TYPES.invalidContainer]: "You must pass a valid container to \"render\" function as a second argument",
  [ERROR_TYPES.duplicateKeys]: "Warning: Encountered two children with the same key. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted.",
};

const DOM_CHANGES_TYPES = {
  prepend: "prepend",
  append: "append",
  insertBefore: "insertBefore",
  insertAfter: "insertAfter",
  replace: "replace",
  remove: "remove",
};

export { ERROR_TYPES, ERROR_MESSAGES, DOM_CHANGES_TYPES, TEXT_ELEMENT, ON, CHILDREN, STYLE, FUNCTION, KEY, BOOLEAN, ARRAY };