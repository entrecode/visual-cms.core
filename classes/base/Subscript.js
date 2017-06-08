const { PhrasingElement, Text } = require('../core');

class Subscript extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString() {
    return `<sub${this.classAttribute}${this.titleAttribute}>${this.content}</sub>`;
  }
}

module.exports = Subscript;
