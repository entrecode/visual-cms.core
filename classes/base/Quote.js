const { FlowElement, PhrasingElement, Text } = require('../core');

/**
 * A HTML `<blockquote>` tag. Subclass of `FlowElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Quote}
 */
class Quote extends FlowElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<blockquote${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</blockquote>`;
  }
}

module.exports = Quote;
