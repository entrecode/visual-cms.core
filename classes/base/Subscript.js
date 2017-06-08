const { PhrasingElement, Text } = require('../core');

class Subscript extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<sub${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</sub>`;
  }
}

module.exports = Subscript;
