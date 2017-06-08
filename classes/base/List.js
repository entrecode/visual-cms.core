const { FlowElement } = require('../core');

class List extends FlowElement {
  get supportedContent() {
    const ListElement = require('./ListElement');
    return [
      ListElement,
    ];
  }

  get settingsSchema() {
    return {
      type: 'object',
      properties: {
        ordered: {
          type: 'boolean',
        },
      },
      required: ['ordered'],
      additionalProperties: false,
    };
  }

  toString(includeID) {
    if (this.settings.ordered) {
      return `<ol${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</ol>`;
    }
    return `<ul${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</ul>`;
  }
}

module.exports = List;
