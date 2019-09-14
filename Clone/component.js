import { forceUpdateCompositeInstance, updateCompositeInstance } from "./reconcile";
import { isEqual, isFunction } from "./utils";

class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  setState(partialState, callback) {
    if (isFunction(partialState)) {
      updateCompositeInstance(this, partialState(this.state, this.props));
    } else {
      updateCompositeInstance(this, partialState);
    }

    if (isFunction(callback)) {
      callback();
    }
  }

  componentDidMount() {
    console.log("didMount")
  }

  componentWillUnmount() {
    console.log("willUnmount")
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
    console.log("didUpdate")
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