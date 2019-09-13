import { updateInstance } from "./CreateInstance";

class Component {
  constructor(props) {
    this.props = props;

    this.state = this.state || {};
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);

    updateInstance(this.instance);
  }

  componentDidMount() {
    console.log(this)
  }

  componentWillUnmount() {
    console.log("willUnmount")
  }
}

export { Component }