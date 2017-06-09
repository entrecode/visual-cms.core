const { PhrasingElement, Text } = require('../core');

/**
 * A HTML `<em>` tag. Subclass of `PhrasingElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Emphasis}
 * @example
 * new Emphasis({
 *   content: 'emphasized'
 * });
 * @example <caption>Resulting HTML:</caption>
 * <em>emphasized</em>
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
