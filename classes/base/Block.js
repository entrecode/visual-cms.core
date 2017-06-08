const { Module, FlowElement } = require('../core');

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
