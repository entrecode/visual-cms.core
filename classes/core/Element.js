const tv4 = require('tv4');
const tv4formats = require('tv4-formats');
const uuidV4 = require('uuid/v4')

const { idSymbol, contentSymbol, supportedContentSymbol, settingsSymbol } = require('./symbols');

const validator = tv4.freshApi();
validator.addFormat(tv4formats);

module.exports = class Element {
  constructor({ content, settings }) {
    this[idSymbol] = uuidV4();
    this[supportedContentSymbol] = new Set();
    this.content = content;
    this.settings = settings;
  }

  get id() {
    return this[idSymbol];
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

  set settings(settings) {
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

  get content() {
    return this[contentSymbol];
  }

  set content(content) {
    const { jsonToElement } = require('../library');

    let contentElements;
    if (!content || (Array.isArray(content) && content.length === 0)) {
      this[contentSymbol] = undefined;
      return;
    } else if (Array.isArray(content)) {
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
  }

  get template() {
    return this.toString();
  }

  getContent(includeID) {
    if (!this[contentSymbol]) {
      return '';
    }
    if (Array.isArray(this[contentSymbol])) {
      return this[contentSymbol].map(child => child.toString(includeID)).join('');
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
            return { [key]: this[contentSymbol][key].map(element => element.toString(includeID)).join('') };
          }
          return { [key]: this[contentSymbol][key].toString(includeID) };
        })
      );
    }
    return this[contentSymbol].content;
  }

  getRootElementAttributes(includeID) {
    let attributeString = '';
    if (includeID) {
      attributeString += ` data-ec-id="${this.id}"`;
    }
    return attributeString;
  }

  toString(includeID) {
    if (includeID) {
      return `<span${this.getRootElementAttributes(includeID)}>${this.getContent()}</span>`;
    }
    return this.content;
  }

  toStringWithDataID() {
    return this.toString(true);
  }

  toJSON() {
    const json = {
      type: this.type,
      settings: this.settings,
      content: undefined,
    };
    if (Array.isArray(this[contentSymbol])) {
      json.content = this[contentSymbol].map(element => element.toJSON());
    } else if (this[contentSymbol] instanceof Element) {
      json.content = this[contentSymbol].toJSON();
    } else if (typeof this[contentSymbol] === 'object') {
      json.content = Object.assign(
        {},
        ...Object.keys(this[contentSymbol])
        .map((key) => {
          if (Array.isArray(this[contentSymbol][key])) {
            return { [key]: this[contentSymbol][key].map(element => element.toJSON()) };
          }
          return { [key]: this[contentSymbol][key].toJSON() };
        })
      );
    }
    if (Object.keys(json.settings).length === 0) {
      delete json.settings;
    }
    if (!json.content) {
      delete json.content;
    }
    return json;
  }
}
