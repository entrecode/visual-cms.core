const { FlowElement, PhrasingElement, Text } = require('../core');

class Headline extends FlowElement {

  get settingsSchema() {
    const schema = super.settingsSchema;
    Object.assign(schema.properties, {
      level: {
        type: 'integer',
        minimum: 1,
        maximum: 6,
      },
    });
    Object.assign(schema, {
      required: [ 'level' ],
    });
    return schema;
  }

  get level() {
    return this.settings.level.toPrecision(1);
  }

  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<h${this.level}${this.classAttribute}${this.titleAttribute}>\
${this.content}</h${this.level}>`;
  }
}

module.exports = Headline;
