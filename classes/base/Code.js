const { PhrasingElement, Text } = require('../core');

/**
 * A HTML `<code>` tag. Subclass of `PhrasingElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Code}
 */
class Code extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<code${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</code>`;
  }
}

module.exports = Code;
