import { isValidContainer, isValidElement, throwError } from "./utils";
import { ERROR_TYPES } from "./constants";
import { reconcile } from "./reconcile";
import { createElement } from "./element";
import { Component, PureComponent } from "./component";

const root = {
  rootInstance: null,
  getRootInstance() {
    return this.rootInstance;
  },
  setRootInstance(newInstance) {
    this.rootInstance = newInstance;
  }
};

function render(element, container) {
  if (!isValidElement(element)) {
    throwError(ERROR_TYPES.invalidElement)
  }

  if (!isValidContainer(container)) {
    throwError(ERROR_TYPES.invalidContainer)
  }

  const oldRootInstance = root.getRootInstance();
  const newRootInstance = reconcile(container, oldRootInstance, element);

  root.setRootInstance(newRootInstance);
}

export { render, createElement, Component, PureComponent };
