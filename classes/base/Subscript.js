const { PhrasingElement, Text } = require('../core');

/**
 * A HTML `<sub>` tag. Subclass of `PhrasingElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Subscript}
 */
class Subscript extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<sub${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</sub>`;
  }
}

module.exports = Subscript;
