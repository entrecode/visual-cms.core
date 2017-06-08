const { FlowElement, PhrasingElement, Text } = require('../core');

class Quote extends FlowElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString() {
    return `<blockquote${this.classAttribute}${this.titleAttribute}>${this.content}</blockquote>`;
  }
}

module.exports = Quote;
