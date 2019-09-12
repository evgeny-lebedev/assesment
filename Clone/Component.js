import { scheduleUpdate } from "./Reconciler";

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }

  setState(partialState) {
    scheduleUpdate(this, partialState);
  }
}

export { Component };