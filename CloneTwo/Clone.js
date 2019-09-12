import { createElement } from "./Element";
import { reconcile } from "./Reconcile";

let rootInstance = null;

function importFromBelow() {

  function render(element, container) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(container, prevInstance, element);
    rootInstance = nextInstance;
  }

  return {
    render,
    createElement
  };
}


const Clone = importFromBelow();

export default Clone;



