const { FlowElement, PhrasingElement, Text } = require('../core');

class Quote extends FlowElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<blockquote${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</blockquote>`;
  }
}

module.exports = Quote;
