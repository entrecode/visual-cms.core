const { FlowElement, PhrasingElement, Text } = require('../core');

/**
 * A HTML `<h1>`-`<h6>` tag. Level is settable.
 * Subclass of `FlowElement`. Can contain `PhrasingElement`s and `Text`.
 * @type {Headline}
 * @example
 * new Headline({
 *   settings: {
 *     level: 3,
 *   },
 *   content: 'my headline'
 * });
 * @example <caption>Resulting HTML:</caption>
 * <h3>my headline</h3>
 */
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

  toString(includeID) {
    return `<h${this.level}${this.getRootElementAttributes(includeID)}>\
${this.getContent(includeID)}</h${this.level}>`;
  }
}

module.exports = Headline;
