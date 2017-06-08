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

  toString() {
    return `<li${this.classAttribute}${this.titleAttribute}>${this.content}</li>`;
  }
}

module.exports = ListElement;
