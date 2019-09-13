import { updateCompositeInstance } from "./CreateInstance";

class Component {
  constructor(props) {
    this.props = props;

    this.state = this.state || {};
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

  componentDidUpdate(comp) {
    console.log("didUpdate");
    console.log(comp)
  }
}

export { Component }