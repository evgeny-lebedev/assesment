import { forceUpdateCompositeInstance, updateCompositeInstance } from "./reconcile";
import { isEqual, isFunction } from "./utils";

class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  setState(state, callback) {
    if (isFunction(state)) {
      updateCompositeInstance(this, state(this.state, this.props));
    } else {
      updateCompositeInstance(this, state);
    }

    if (isFunction(callback)) {
      callback();
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
  }

  forceUpdate() {
    forceUpdateCompositeInstance(this)
  }
}

class PureComponent extends Component {

  shouldComponentUpdate(prevProps, nextProps) {
    return isEqual(prevProps, nextProps);
  }

}

export { Component, PureComponent };