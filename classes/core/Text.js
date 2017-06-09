const he = require('he');

const Element = require('./Element');
const { contentSymbol } = require('./symbols');

/**
 * Basic text content Element.
 * Behaves special in some places because the content is just a string.
 * @type {Text}
 * @example
 * new Text(`This is a string
 * with a new line. <h1>No headline!</h1>`);
 * @example <caption>Resulting HTML:</caption>
 * This is a string<br>with a new line. &#x3C;h1&#x3E;No headline!&#x3C;/h1&#x3E;
 */
class Text extends Element {
  /**
   * Only accepts a string as content.
   * @param {string} string
   */
  constructor(string) {
    super({ content: [] });
    this.content = string;
  }

  /**
   * Getter for the content, which will return escaped HTML.
   * @return {string} the escaped output string, newlines are rendered as `<br>`.
   */
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
