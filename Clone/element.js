import { STRING, TEXT_ELEMENT, WARNING_TYPES } from "./constants";
import { hasElementsKeys, filterValid, checkKeys, showWarning, isElementValid } from "./utils";

function createElement(type, config, ...rawChildren) {
  const children = handleRawChildren(rawChildren);
  const props = { ...config, children };

  return { type, props };
}

function handleRawChildren(rawChildren) {

  const withKeys = rawChildren.map((rawChild, index) => {
    if (Array.isArray(rawChild)) {
      const hasKeys = hasElementsKeys(filterValid(rawChild));

      if (!hasKeys) {
        showWarning(WARNING_TYPES.noKeys);

        return rawChild.map((element, index) => ({ ...element, props: { ...element.props, key: index } }));
      } else {
        checkKeys(rawChild);

        return rawChild;
      }
    }

    if (typeof rawChild !== STRING && isElementValid(rawChild)) {
      return { ...rawChild, props: { ...rawChild.props, key: index } }
    }

    return rawChild;
  });

  return filterValid(withKeys).map((child, index) => child instanceof Object ? child : createTextElement(child, index))
}

function createTextElement(nodeValue, key) {
  return createElement(TEXT_ELEMENT, { nodeValue, key });
}

export { createElement };