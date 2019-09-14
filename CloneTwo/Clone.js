import { createElement } from "./Element";
import { reconcile } from "./Reconcile";
import { Component, PureComponent } from "./Component";
import { errorToConsole, isValidContainer, isValidElement } from "./Utils";
import { ERROR_TYPES } from "./Constants";

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
  if (!isValidElement(element)){
    errorToConsole(ERROR_TYPES.invalidElement)
  }

  if (!isValidContainer(container)){
    errorToConsole(ERROR_TYPES.invalidContainer)
  }

  const oldRootInstance = root.getRootInstance();

  const newRootInstance = reconcile(container, oldRootInstance, element);

  root.setRootInstance(newRootInstance);
}

const Clone = { render, createElement, Component, PureComponent };

export default Clone;



