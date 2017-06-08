const { PhrasingElement, Text } = require('../core');

class Code extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString() {
    return `<code${this.classAttribute}${this.titleAttribute}>${this.content}</code>`;
  }
}

module.exports = Code;
