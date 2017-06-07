const { PhrasingElement, Text } = require('../core');

class Emphasis extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<em${this.classAttribute}${this.titleAttribute}>${this.content}</em>`;
  }
}

module.exports = Emphasis;
