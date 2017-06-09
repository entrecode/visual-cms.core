const { Module, FlowElement } = require('../core');

/**
 * The simplest possible `Module`. Simply a `<div>` containing `FlowElement`s.
 * @type {Block}
 * @example
 * new Block({
 *   content: [
 *     new Headline({level: 1, content: 'Hello World!'}),
 *     new Paragraph({content: 'Text'}),
 *   ],
 * });
 * @example <caption>Resulting HTML:</caption>
 * <div>
 *   <h1>Hello World!</h1>
 *   <p>Text</p>
 * </div>
 */
class Block extends Module {
  get supportedContent() {
    return [
      FlowElement,
    ];
  }

  toString(includeID) {
    return `<div${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</div>`;
  }
}

module.exports = Block;
