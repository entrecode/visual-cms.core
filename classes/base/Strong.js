const { PhrasingElement, Text } = require('../core');

class Strong extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<strong${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</strong>`;
  }
}

module.exports = Strong;
