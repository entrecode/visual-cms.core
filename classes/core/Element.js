const tv4 = require('tv4');
const tv4formats = require('tv4-formats');
const uuidV4 = require('uuid/v4');

const { idSymbol, contentSymbol, supportedContentSymbol, settingsSymbol } = require('./symbols');

const validator = tv4.freshApi();
validator.addFormat(tv4formats);

/**
 * The base class. All Visual-CMS-Elements are inherited from Element.
 * @type {Element}
 */
module.exports = class Element {

  /**
   * create a new Element
   * @param {JSON} settings
   * @param {(Element|JSON)} settings.content Content of the element, either Element objects or JSON
   * @param {JSON} settings.settings arbitrary settings, if the element supports it
   */
  constructor({ content, settings }) {
    this[idSymbol] = uuidV4();
    this[supportedContentSymbol] = new Set();
    this.content = content;
    this.settings = settings;
  }

  /**
   * Getter for the UUID of the element (readonly)
   * @returns {String} a version 4 UUID
   */
  get id() {
    return this[idSymbol];
  }

  /**
   * Getter for the type of the element  (readonly)
   * @returns {String} the Class name lowercased.
   */
  get type() {
    return this.constructor.name.toLowerCase();
  }

  /**
   * Getter for the List of supported content elements  (readonly)
   * @returns {Array<Class>} an Array of Element Classes
   */
  get supportedContent() {
    return [];
  }

  /**
   * List of supported content elements, supports multiple content blocks
   * @param {String} [property] if given, returns the list of supported content elements for that.
   * Otherwise the same as the `supportedContent` property content block
   * @returns {Array.<Class>} an Array of Element Classes
   */
  getSupportedContent(property) {
    return this.supportedContent;
  }

  /**
   * check if the element supports the given content
   * @param {Element} content the content to check
   * @param {String} [property] if given, check if `content` can be used in this content block.
   * Checks the main content block if omitted
   * @returns {boolean} `true`, if the element is supported as content.
   */
  supportsContent(content, property) {
    return this.getSupportedContent(property).some(Class => content instanceof Class);
  }

  /**
   * Getter for the JSON schema for the settings object (readonly)
   * @returns {JSON} JSON Schema
   */
  get settingsSchema() {
    return {
      type: 'object',
      additionalProperties: false,
    };
  }

  /**
   * Getter for the settings object of the element
   * @returns {JSON} settings object, conforming to `settingsSchema`
   */
  get settings() {
    return this[settingsSymbol];
  }

  /**
   * Setter for the settings object of the element
   * @param {JSON} settings object to set, must conform to the JSON Schema `settingsSchema`.
   */
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

  /**
   * Getter for the bare content object
   * @returns {(Element|String|Array<Element,String>|JSON)} Elements, Strings or an Array of those
   */
  get content() {
    return this[contentSymbol];
  }

  /**
   * Setter for content on the Element. May be single content, an object with content or an Array
   * of content
   * @param {(Element|String|Array<Element,String>|JSON)} content to set
   */
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

  /**
   * the rendered HTML of the element (readonly)
   * @returns {String} HTML code
   */
  get template() {
    return this.toString();
  }

  /**
   * The find() method returns the value of the first element in the Element's content subtree
   * that satisfies the provided testing function. Otherwise `false` is returned.
   * @param {function} fn Testing function the target element must conform to.
   * @returns {(Element|boolean)}
   */
  find(fn) {
    if (fn(this)) { // break case 0: we are the element itself
      return this;
    }
    if (typeof this.content === 'string') {
      return false; // break case 1: we are at a leaf node (simple text)
    }
    if (this.content instanceof Element) {
      return this.content.find(fn); // break case 2: we have a single Element, call Element.find
    }
    let iterableChildren = this.content;
    if (!Array.isArray(this.content)) { // if content is an object, we need to flatten it
      iterableChildren = Object.keys(this.content)
      .map(key => this.content[key])
      .reduce((a, b) => a.concat(b));
    }
    return iterableChildren.find(fn) || iterableChildren // call Array.find on children array
      .reduce((found, child) => found || child.find(fn), false); // call Element.find on children
  }

  /**
   * returns the rendered content for usage in the `toString()` method
   * @param {boolean} [includeID] if `true`, elements will get an `data-ec-id` attribute with their
   *   id
   * @returns {(string|JSON)} Rendered HTML of the contents, or the content blocks object if using
   * content blocks
   */
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
    return this[contentSymbol].toString(includeID);
  }

  /**
   * Returns a string containing attributes for the outermost HTML element
   * @param {boolean} [includeID] if `true`, elements will get an `data-ec-id` attribute with their
   *   id
   * @returns {string} rendered HTML
   */
  getRootElementAttributes(includeID) {
    let attributeString = '';
    if (includeID) {
      attributeString += ` data-ec-id="${this.id}"`;
    }
    return attributeString;
  }

  /**
   * Render the Element as HTML.
   * @param {boolean} [includeID] if `true`, elements will get an `data-ec-id` attribute with their
   *   id
   * @returns {string} rendered HTML
   */
  toString(includeID) {
    if (includeID) {
      return `<span${this.getRootElementAttributes(includeID)}>${this.getContent(includeID)}</span>`;
    }
    return this.content;
  }

  /**
   * Renders the Element as HTML. Elements will get an `data-ec-id` attribute with their id.
   * Alias for `toString(true)`
   * @returns {string} rendered HTML
   */
  toStringWithDataID() {
    return this.toString(true);
  }

  /**
   * get a JSON representation of the Element and all its child elements
   * @returns {JSON} the full JSON of the Element
   */
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
};
