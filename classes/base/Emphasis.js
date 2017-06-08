const { PhrasingElement, Text } = require('../core');

class Emphasis extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<em${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</em>`;
  }
}

module.exports = Emphasis;
