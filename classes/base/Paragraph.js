const { FlowElement, PhrasingElement, Text } = require('../core');

class Paragraph extends FlowElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString() {
    return `<p${this.classAttribute}${this.titleAttribute}>${this.content}</p>`;
  }
}

module.exports = Paragraph;
