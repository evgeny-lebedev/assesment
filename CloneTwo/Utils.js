import { CHILDREN, FUNCTION, ON, STYLE } from "./Constants";
import { PureComponent } from "./Component";

function isElementComponent(element) {
  return element && typeof element.type === FUNCTION;
}

function isEqual(a, b) {
  return a === b || JSON.stringify(a) === JSON.stringify(b)
}

function isInstanceOfPureComponent(componentInstance) {
  return componentInstance && componentInstance instanceof PureComponent;
}

function isValid(item) {
  return !!item;
}

function filterValid(items) {
  return items.filter(isValid);
}

function isPropEvent(name) {
  return name.startsWith(ON);
}

function isPropAttribute(name) {
  return !isPropEvent(name) && name !== CHILDREN && name !== STYLE;
}

function isPropNew(prev, next) {
  return function (key) {
    return prev[key] !== next[key];
  }
}

function isPropGone(prev, next) {
  return function (key) {
    return !(key in next);
  }
}

export {
  isElementComponent,
  isEqual,
  isInstanceOfPureComponent,
  isValid,
  filterValid,
  isPropEvent,
  isPropAttribute,
  isPropNew,
  isPropGone
};