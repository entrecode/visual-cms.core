const { PhrasingElement, Text } = require('../core');

class Strong extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<strong${this.classAttribute}${this.titleAttribute}>${this.content}</strong>`;
  }
}

module.exports = Strong;
