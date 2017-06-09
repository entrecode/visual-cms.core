const he = require('he');

const Element = require('./Element');
const { contentSymbol } = require('./symbols');

/**
 * Basic text content Element.
 * Behaves special in some places because the content is just a string.
 * @type {Text}
 */
class Text extends Element {
  constructor(string) {
    super({ content: [] });
    this.content = string;
  }

  get content() {
    return he.encode(this[contentSymbol]).replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  /**
   * Setter for content. Only supports Strings.
   * @param {string} content The string content to set
   */
  set content(content) {
    if (Array.isArray(content) && content.length === 0) {
      this[contentSymbol] = '';
      return;
    }
    if (typeof content !== 'string') {
      throw new Error('Text only supports string content!');
    }
    this[contentSymbol] = content;
  }

  /**
   * Returns the JSON representation, which is just the string itself
   * @returns {*}
   */
  toJSON() {
    return this.content;
  }
}

module.exports = Text;
