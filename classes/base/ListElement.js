const { Element, PhrasingElement, Text } = require('../core');
const List = require('./List');

class ListElement extends Element {
  get supportedContent() {
    return [
      List,
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<li>${this.content}</li>`;
  }
}

module.exports = ListElement;
