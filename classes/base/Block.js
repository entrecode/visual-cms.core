const { Module, FlowElement } = require('../core');

/**
 * The simplest possible `Module`. Simply a `<div>` containing `FlowElement`s.
 * @type {Block}
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
