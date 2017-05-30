const contentSymbol = Symbol('content');
const supportedContentSymbol = Symbol('supportedContent');
const settingsSymbol = Symbol('settings');

const library = new Map();

function jsonToElement(json) {
  if (json instanceof Element) {
    return json;
  }
  const type = typeof json === 'string' ? 'text' : json.type;
  const Class = library.get(type);
  return new Class(json);
}

class Element {
  constructor({ content, settings }) {
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
    this[settingsSymbol] = Object.assign({}, settings);
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

  get settings() {
    return this[settingsSymbol];
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

class FlowElement extends Element {

}

class ListElement extends Element {
  get supportedContent() {
    return [
      PhrasingElement,
      Text
    ]
  }

  get template() {
    return `<li>${this.content}</li>`;
  }
}

class List extends FlowElement {
  get supportedContent() {
    return [
      List,
      ListElement
    ];
  }

  get template() {
    if (this.settings.ordered) {
      return `<ol>${this.content}</ol>`;
    } else {
      return `<ul>${this.content}</ul>`;
    }
  }
}

library.set('text', Text);
library.set('strong', Strong);
library.set('list', List);
library.set('listelement', ListElement);


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
    ListElement,
    List,
  },
  parse,
};
