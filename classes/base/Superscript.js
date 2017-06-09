const { PhrasingElement, Text } = require('../core');

/**
 * A HTML `<sup>` tag. Subclass of `PhrasingElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Superscript}
 */
class Superscript extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<sup${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</sup>`;
  }
}

module.exports = Superscript;
