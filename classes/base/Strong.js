const { PhrasingElement, Text } = require('../core');

/**
 * A HTML `<strong>` tag. Subclass of `PhrasingElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Strong}
 * @example
 * new Strong({
 *   content: 'strongened'
 * });
 * @example <caption>Resulting HTML:</caption>
 * <strong>strongened</strong>
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
