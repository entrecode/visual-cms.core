const { FlowElement, PhrasingElement, Text } = require('../core');

class Paragraph extends FlowElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<p${this.classAttribute}>${this.content}</p>`;
  }
}

module.exports = Paragraph;
