const contentSymbol = Symbol('content');
const supportedContentSymbol = Symbol('supportedContent');

const library = new Map();

function jsonToElement(json) {
  if (json instanceof Element) {
    return json;
  }
  const type = typeof json === 'string' ? 'text' : json.type;
  const Class = library.get(type);
  return new Class(json);
}

function addContent(content) {
  let contentElements;
  if (Array.isArray(content)) {
    contentElements = content.map(contentPart => jsonToElement(contentPart));
  } else {
    contentElements = jsonToElement(content);
  }
  if (Array.isArray(contentElements)) {
    return contentElements.filter(contentPart => this.supportsContent(contentPart));
  } else {
    return this.supportsContent(contentElements) ? contentElements : null;
  }
}

class Element {
  constructor({ content }) {
    this[supportedContentSymbol] = new Set();
    let contentElements;
    if (Array.isArray(content)) {
      contentElements = content.map(contentPart => jsonToElement(contentPart));
    } else {
      contentElements = jsonToElement(content);
    }
    if (Array.isArray(contentElements)) {
      this[contentSymbol] = contentElements.filter(contentPart => this.supportsContent(contentPart));
    } else {
      this[contentSymbol] = this.supportsContent(contentElements) ? contentElements : null;
    }
  }

  get type() {
    return this.constructor.name.toLowerCase();
  }

  get supportedContent() {
    return [];
  }

  supportsContent(content) {
    return this.supportedContent.some(Class => content instanceof Class);
  }

  get content() {
    if (this[contentSymbol] === null) {
      return '';
    }
    if (Array.isArray(this[contentSymbol])) {
      return this[contentSymbol].map(child => child.template).join('');
    }
    if (typeof this[contentSymbol] === 'string') {
      return this[contentSymbol];
    }
    if (!(this[contentSymbol] instanceof Element)) {
      return Object.assign(
        {},
        Object.keys(this[contentSymbol])
        .map(key => ({ [key]: this[contentSymbol][key].content }))
      );
    }
    return this[contentSymbol].content;

  }

  get template() {
    return this.content;
  }

  toString() {
    return this.template;
  }
}

class Text extends Element {
  constructor(string) {
    super({ content: [] });
    this[contentSymbol] = string;
  }

  get content() {
    return this[contentSymbol];
  }
}

class PhrasingElement extends Element {

}

class Strong extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text
    ]
  }

  get template() {
    return `<strong>${this.content}</strong>`;
  }
}
library.set('text', Text);
library.set('strong', Strong);


function parse(json) {
  if (Array.isArray(json)) {
    return json.map(contentPart => parse(contentPart));
  }
  const type = typeof json === 'string' ? 'text' : json.type;
  const Class = library.get(type);
  return new Class(json);
}

module.exports = {
  elements: {
    Text,
    Strong,
  },
  parse,
};
