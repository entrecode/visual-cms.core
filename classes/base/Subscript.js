const { PhrasingElement, Text } = require('../core');

class Subscript extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<sub${this.classAttribute}${this.titleAttribute}>${this.content}</sub>`;
  }
}

module.exports = Subscript;
