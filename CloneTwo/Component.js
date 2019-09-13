import { forceUpdateCompositeInstance, updateCompositeInstance } from "./Reconcile";
import { isEqual } from "./Utils";

class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  setState(partialState) {
    updateCompositeInstance(this, partialState);
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