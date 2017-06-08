const { PhrasingElement, Text } = require('../core');

class Code extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<code${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</code>`;
  }
}

module.exports = Code;
