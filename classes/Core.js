const tv4 = require('tv4');
const tv4formats = require('tv4-formats');

const validator = tv4.freshApi();
validator.addFormat(tv4formats);

const contentSymbol = Symbol('content');
const supportedContentSymbol = Symbol('supportedContent');
const settingsSymbol = Symbol('settings');
const library = new Map();

function jsonToElement(json) {
  const type = typeof json === 'string' ? 'text' : json.type;
  const Class = library.get(type);
  if (!Class) {
    throw new Error(`Class '${type}' not found`);
  }
  return new Class(json);
}

class Element {
  constructor({ content, settings }) {
    this[supportedContentSymbol] = new Set();
    let contentElements;
    if (Array.isArray(content)) {
      contentElements = content.map(contentPart => jsonToElement(contentPart));
    } else if (content instanceof Element) {
      contentElements = content;
    } else if (typeof content === 'object' && !('type' in content)) {
      contentElements = Object.assign(
        {},
        ...Object.keys(content).map((key) => {
          if (Array.isArray(content[key])) {
            return { [key]: content[key].map(jsonToElement) };
          }
          return { [key]: jsonToElement(content[key]) };
        })
      );
    } else {
      contentElements = jsonToElement(content);
    }
    if (Array.isArray(contentElements)) {
      this[contentSymbol] = contentElements.filter(cPart => this.supportsContent(cPart));
    } else if (contentElements instanceof Element) {
      this[contentSymbol] = this.supportsContent(contentElements) ? contentElements : null;
    } else {
      this[contentSymbol] = Object.assign(
        {},
        ...Object.keys(contentElements)
        .filter((key) => {
          if (Array.isArray(contentElements[key])) {
            return contentElements[key].every(elem => this.supportsContent(elem, key));
          }
          return this.supportsContent(contentElements[key], key);
        })
        .map(key => ({ [key]: contentElements[key] }))
      );
    }
    if (settings) {
      const validation = validator.validateResult(settings, this.settingsSchema);
      if (!validation.valid) {
        throw new Error(`invalid settings: ${JSON.stringify(validation)}`);
      }
      this[settingsSymbol] = Object.assign({}, settings);
    } else {
      this[settingsSymbol] = {};
    }
  }

  get type() {
    return this.constructor.name.toLowerCase();
  }

  get supportedContent() {
    return [];
  }

  getSupportedContent(property) {
    return this.supportedContent;
  }

  supportsContent(content, property) {
    return this.getSupportedContent(property).some(Class => content instanceof Class);
  }

  get settingsSchema() {
    return {
      type: 'object',
      additionalProperties: false,
    };
  }

  get settings() {
    return this[settingsSymbol];
  }

  get content() {
    if (!this[contentSymbol]) {
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
        ...Object.keys(this[contentSymbol])
        .map((key) => {
          if (Array.isArray(this[contentSymbol][key])) {
            return { [key]: this[contentSymbol][key].map(element => element.template).join('') };
          }
          return { [key]: this[contentSymbol][key].template };
        })
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

class PhrasingElement extends BaseElement {

}

class Strong extends PhrasingElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<strong${this.classAttribute}>${this.content}</strong>`;
  }
}

class FlowElement extends BaseElement {

}

class Paragraph extends FlowElement {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<p${this.classAttribute}>${this.content}</p>`;
  }
}

class ListElement extends Element {
  get supportedContent() {
    return [
      PhrasingElement,
      Text,
    ];
  }

  get template() {
    return `<li>${this.content}</li>`;
  }
}

class List extends FlowElement {
  get supportedContent() {
    return [
      List,
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

class Module extends Element {

}

class Grid extends Module {
  get supportedContent() {
    return [
      FlowElement,
    ];
  }

  getSupportedContent(property) {
    switch (property) {
    case 'column1':
      return [Paragraph];
    default:
      return this.supportedContent;
    }
  }

  get settingsSchema() {
    return {
      type: 'object',
      properties: {
        columns: {
          type: 'string',
          pattern: '^[1-9][0-9]*(,[1-9][0-9]*)*$',
        },
      },
      required: ['columns'],
      additionalProperties: false,
    };
  }

  get template() {
    const columns = this.settings.columns.split(',')
    .map((columnSize, columnNumber) => `<div class="col-${columnSize}">${this.content[`column${columnNumber}`] || ''}</div>`);
    return `<div class="grid">${columns.join('')}</div>`;
  }
}

library.set('text', Text);
library.set('strong', Strong);
library.set('list', List);
library.set('listelement', ListElement);
library.set('paragraph', Paragraph);
library.set('grid', Grid);

function parse(json) {
  if (Array.isArray(json)) {
    return json.map(contentPart => parse(contentPart));
  }
  const type = typeof json === 'string' ? 'text' : json.type;
  const Class = library.get(type);
  if (!Class) {
    throw new Error(`Class '${type}' not found`);
  }
  return new Class(json);
}

module.exports = {
  elements: {
    Text,
    Strong,
    Paragraph,
    ListElement,
    List,
    Grid,
  },
  parse,
};