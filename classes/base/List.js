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

  get template() {
    if (this.settings.ordered) {
      return `<ol${this.classAttribute}>${this.content}</ol>`;
    }
    return `<ul${this.classAttribute}>${this.content}</ul>`;
  }
}

module.exports = List;
