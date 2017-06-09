const { BaseElement, PhrasingElement, Text } = require('../core');
const List = require('./List');

/**
 * A HTML `<li>` tag. Subclass of `BaseElement`. Can contain `List`, `PhrasingElement`s and `Text`
 * @type {ListElement}
 */
class ListElement extends BaseElement {
  get supportedContent() {
    return [
      List,
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<li${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</li>`;
  }
}

module.exports = ListElement;
