const Element = require('./Element');

class BaseElement extends Element {
  get settingsSchema() {
    return {
      type: 'object',
      properties: {
        class: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^[a-zA-Z0-9\\-_]+$',
          },
        },
      },
      additionalProperties: false,
    };
  }

  get classAttribute() {
    if (this.classAttributeValue.length > 0) {
      return ` class="${this.classAttributeValue}"`;
    }
    return '';
  }

  get classAttributeValue() {
    const classArray = this.settings.class;
    if (!classArray || !Array.isArray(classArray) || classArray.length === 0) {
      return '';
    }
    return classArray.join(' ');
  }

}

module.exports = BaseElement;
