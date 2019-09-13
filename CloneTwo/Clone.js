import { createElement } from "./Element";
import { reconcile } from "./Reconcile";
import { Component, PureComponent } from "./Component";

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
  const oldRootInstance = root.getRootInstance();

  const newRootInstance = reconcile(container, oldRootInstance, element);

  root.setRootInstance(newRootInstance);
}

const Clone = { render, createElement, Component, PureComponent };

export default Clone;



