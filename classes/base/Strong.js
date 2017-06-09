const { PhrasingElement, Text } = require('../core');

/**
 * A HTML `<strong>` tag. Subclass of `PhrasingElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Strong}
 */
class Strong extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<strong${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</strong>`;
  }
}

module.exports = Strong;
