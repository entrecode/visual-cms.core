const { PhrasingElement, Text } = require('../core');

class Superscript extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<sup${this.classAttribute}${this.titleAttribute}>${this.content}</sup>`;
  }
}

module.exports = Superscript;
