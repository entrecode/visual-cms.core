const { FlowElement, PhrasingElement, Text } = require('../core');

class Paragraph extends FlowElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<p${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</p>`;
  }
}

module.exports = Paragraph;
