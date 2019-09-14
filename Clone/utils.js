import { BOOLEAN, CHILDREN, ERROR_MESSAGES, ERROR_TYPES, FUNCTION, KEY, ON, STYLE } from "./constants";
import { PureComponent } from "./component";

function isFunction(item) {
  return item && typeof item === FUNCTION;
}

function isElementComponent(element) {
  return element && typeof element.type === FUNCTION;
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

function errorToConsole(errorType) {
  console.error(ERROR_MESSAGES[errorType])
}

function throwError(errorType) {
  throw new Error(ERROR_MESSAGES[errorType])
}

function isValidElement(element) {
  return isValid(element);
}

function isValidContainer(container) {
  return container instanceof Element;
}

function isValidKey(key) {
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

function elementsHasKeys(elements) {
  return elements.every(element => element.props.hasOwnProperty(KEY))
}

function getElementByKey(elements, key) {
  return elements.find(element => element.props.key === key)
}

function areKeysValid(instances) {
  let areUnique = true;

  instances.forEach((instance, index) => {
    if (index > 0) {
      const currentKey = instance.key;
      const prevKey = instances[index - 1].key;

      if (!isValidKey(prevKey) || !isValidKey(currentKey) || (prevKey === currentKey)) {
        throwError(ERROR_TYPES.invalidKeys)
      }
    }
  });

  return areUnique;
}

export {
  isValidElement,
  isValidContainer,
  errorToConsole,
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
  elementsHasKeys,
  getElementByKey,
  areKeysValid,
};