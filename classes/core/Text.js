const Element = require('./Element');
const { contentSymbol } = require('./symbols');

class Text extends Element {
  constructor(string) {
    super({ content: [] });
    this.content = string;
  }

  get content() {
    return this[contentSymbol];
  }

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

  toString() {
    return this.content;
  }

  toJSON() {
    return this.content;
  }
}

module.exports = Text;
