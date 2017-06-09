const { FlowElement, PhrasingElement, Text } = require('../core');

/**
 * A HTML `<p>` tag. Subclass of `FlowElement`. Can contain `PhrasingElement`s and `Text`
 * @type {Paragraph}
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
