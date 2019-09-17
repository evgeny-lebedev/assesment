import {
  ARRAY,
  BOOLEAN,
  CHILDREN,
  ERROR_MESSAGES,
  ERROR_TYPES,
  FUNCTION,
  KEY,
  ON,
  STYLE,
  WARNING_MESSAGES
} from "./constants";
import { PureComponent } from "./component";

function isFunction(item) {
  return item && typeof item === FUNCTION;
}

function isElementComponent(element) {
  return element && typeof element.type === FUNCTION;
}

function isInstanceArrayType(instance) {
  return instance.type === ARRAY;
}

function isEqual(a, b) {
  if (a === b) {
    return true
  } else {
    return a === b || JSON.stringify(a) === JSON.stringify(b);
  }
}

function isInstanceOfPureComponent(componentInstance) {
  return componentInstance && componentInstance instanceof PureComponent;
}

function isValid(item) {
  return item === 0 || !!item;
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

function showWarning(errorType) {
  console.error(WARNING_MESSAGES[errorType])
}

function throwError(errorType) {
  throw new Error(ERROR_MESSAGES[errorType])
}

function isElementValid(element) {
  return isValid(element);
}

function isContainerValid(container) {
  return container instanceof Element;
}

function isKeyValid(key) {
  if (key === 0) {
    return true;
  }

  if (key instanceof Object) {
    return false
  }

  if (typeof key === BOOLEAN) {
    return false
  }

  return !!key;
}

function hasElementsKeys(elements) {
  return elements.every(element => element.props.hasOwnProperty(KEY))
}

function getElementByKey(elements, key) {
  return elements.find(element => element.props.key === key)
}

function getInstanceByKey(instances, key) {
  return instances.find(instance => instance.key === key)
}

function checkKeys(elements) {
  elements.forEach((element, index) => {
    if (index > 0) {
      const currentKey = element.props.key;
      const prevKey = elements[index - 1].props.key;

      if (!isKeyValid(currentKey)){
        throwError(ERROR_TYPES.invalidKeys)
      }

      if (prevKey === currentKey) {
        throwError(ERROR_TYPES.duplicateKeys)
      }
    }
  });
}

export {
  isElementValid,
  isContainerValid,
  showWarning,
  throwError,
  isFunction,
  isElementComponent,
  isEqual,
  isInstanceOfPureComponent,
  isValid,
  filterValid,
  isPropEvent,
  isPropAttribute,
  isPropNew,
  isPropGone,
  hasElementsKeys,
  getElementByKey,
  getInstanceByKey,
  checkKeys,
  isInstanceArrayType,
};