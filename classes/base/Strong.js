const { PhrasingElement, Text } = require('../core');

class Strong extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<strong${this.classAttribute}>${this.content}</strong>`;
  }
}

module.exports = Strong;
