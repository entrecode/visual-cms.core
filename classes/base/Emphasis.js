const { PhrasingElement, Text } = require('../core');

/**
 * A HTML `<em>` tag. Subclass of `PhrasingElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Emphasis}
 */
class Emphasis extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<em${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</em>`;
  }
}

module.exports = Emphasis;
