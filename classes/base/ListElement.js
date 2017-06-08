const { BaseElement, PhrasingElement, Text } = require('../core');
const List = require('./List');

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
