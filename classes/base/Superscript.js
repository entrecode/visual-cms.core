const { PhrasingElement, Text } = require('../core');

class Superscript extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<sup${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</sup>`;
  }
}

module.exports = Superscript;
