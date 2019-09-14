const TEXT_ELEMENT = "TEXT ELEMENT";
const ON = "on";
const CHILDREN = "children";
const STYLE = "style";
const FUNCTION = "function";
const KEY = "key";

const ERROR_TYPES = {
  noKeys: "noKeys",
  invalidElement: "invalidElement",
  invalidContainer: "invalidContainer",
};

const ERROR_MESSAGES = {
  [ERROR_TYPES.noKeys]: "Each item of array should have a \"key\" property for better performance.",
  [ERROR_TYPES.invalidElement]: "You must pass a valid element to \"render\" function as a first argument",
  [ERROR_TYPES.invalidContainer]: "You must pass a valid container to \"render\" function as a second argument",
};

export { ERROR_TYPES, ERROR_MESSAGES, TEXT_ELEMENT, ON, CHILDREN, STYLE, FUNCTION, KEY };