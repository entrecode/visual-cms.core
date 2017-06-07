const { PhrasingElement, Text } = require('../core');

class Link extends PhrasingElement {

  get settingsSchema() {
    const schema = super.settingsSchema;
    Object.assign(schema.properties, {
      href: {
        type: 'string',
        format: 'uri',
      },
      newTab: {
        type: 'boolean',
      },
      rel: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    });
    Object.assign(schema, {
      required: [ 'href' ],
    });
    return schema;
  }

  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get relAttribute() {
    if (this.relAttributeValue.length > 0) {
      return ` rel="${this.relAttributeValue}"`;
    }
    return '';
  }

  get relAttributeValue() {
    const relArray = this.settings.rel;
    if (!relArray || !Array.isArray(relArray) || relArray.length === 0) {
      return '';
    }
    return relArray.join(' ');
  }

  get targetAttribute() {
    if (this.settings.newTab) {
      return ' target="_blank"';
    }
    return '';
  }

  get template() {
    return `\
<a href="${this.settings.href}"\
${this.targetAttribute}\
${this.relAttribute}\
${this.classAttribute}\
${this.titleAttribute}>${this.content}</a>`;
  }
}

module.exports = Link;
