const { FlowElement, PhrasingElement, Text } = require('../core');

/**
 * A HTML `<p>` tag. Subclass of `FlowElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Paragraph}
 * @example
 * new Paragraph({
 *   content: 'Text'
 * });
 * @example <caption>Resulting HTML:</caption>
 * <p>Text</p>
 */
class Paragraph extends FlowElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  toString(includeID) {
    return `<p${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</p>`;
  }
}

module.exports = Paragraph;
