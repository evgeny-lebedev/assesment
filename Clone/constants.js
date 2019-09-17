const TEXT_ELEMENT = "TEXT ELEMENT";
const ON = "on";
const CHILDREN = "children";
const STYLE = "style";
const FUNCTION = "function";
const KEY = "key";
const BOOLEAN = "boolean";
const ARRAY = "array";

const WARNING_TYPES = {
  noKeys: "noKeys",
};

const ERROR_TYPES = {
  invalidElement: "invalidElement",
  invalidContainer: "invalidContainer",
  invalidKeys: "invalidKeys",
  duplicateKeys: "duplicateKeys",
};

const WARNING_MESSAGES = {
  [WARNING_TYPES.noKeys]: "Each child in a list should have a unique \"key\" prop",
};

const ERROR_MESSAGES = {
  [ERROR_TYPES.invalidElement]: "You must pass a valid element to \"render\" function as a first argument",
  [ERROR_TYPES.invalidContainer]: "You must pass a valid container to \"render\" function as a second argument",
  [ERROR_TYPES.invalidKeys]: "Invalid keys. Only number or string allowed.",
  [ERROR_TYPES.duplicateKeys]: "Encountered two children with the same key. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted.",
};

const DOM_CHANGES_TYPES = {
  prepend: "prepend",
  append: "append",
  insertBefore: "insertBefore",
  insertAfter: "insertAfter",
  replace: "replace",
  remove: "remove",
};

export { WARNING_TYPES, ERROR_TYPES, WARNING_MESSAGES, ERROR_MESSAGES, DOM_CHANGES_TYPES, TEXT_ELEMENT, ON, CHILDREN, STYLE, FUNCTION, KEY, BOOLEAN, ARRAY };