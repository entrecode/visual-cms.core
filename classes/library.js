const {
  Element,
  Text,
  Block,
  Code,
  Emphasis,
  Headline,
  Image,
  Link,
  List,
  ListElement,
  Paragraph,
  Quote,
  Strong,
  Subscript,
  Superscript,
} = require('./elements');

const library = new Map();

library.set('text', Text);
[
  Block,
  Code,
  Emphasis,
  Headline,
  Image,
  Link,
  List,
  ListElement,
  Paragraph,
  Quote,
  Strong,
  Subscript,
  Superscript,
].forEach((Class) => {
  library.set(Class.name.toLowerCase(), Class);
});

const abstractTypes = ['baseelement', 'phrasingelement', 'flowelement', 'module'];
/**
 * Register a new Element Class for usage with Visual CMS.
 * @name vcms.register
 * @param {...Class} elementsToAdd Subclasses of Element to register
 */
function register(...elementsToAdd) {
  elementsToAdd.forEach((elementClass) => {
    if (!(elementClass.prototype instanceof Element)) {
      throw new Error('Class cannot be registered, not inherited from Element.');
    }
    const type = elementClass.prototype.constructor.name.toLowerCase();
    if (abstractTypes.includes(type)) {
      throw new Error(`Element type ${type} is an abstract type and cannot be overwritten.`);
    }
    if (library.has(type)) {
      throw new Error(`Element type ${type} is already registered and cannot be overwritten.`);
    }
    library.set(type, elementClass);
  });
}

/**
 * Return the correct class for a type identifier string
 * @name vcms.getClass
 * @param {string} type The type of the element to get, e.g. `paragraph`;
 * @returns {Class} the Class
 * @throws Error when the class is not found / not registered yet.
 */
function getClass(type) {
  const Class = library.get(type);
  if (!Class) {
    throw new Error(`Class '${type}' not found`);
  }
  return Class;
}

function jsonToElement(json) {
  if (json instanceof Element) {
    return json;
  }
  const type = typeof json === 'string' ? 'text' : json.type;
  const Class = getClass(type);
  return new Class(json);
}

/**
 * Parse a Visual-CMS JSON into Visual-CMS Objects
 * @name vcms.parse
 * @param {JSON} json a valid JSON to parse
 * @returns {(Element|Array<Element>)} Element or List of Elements
 * @throws Error when unknown types are used.
 */
function parse(json) {
  if (Array.isArray(json)) {
    const array = json.map(contentPart => parse(contentPart));
    array.toString = function toString(includeID) {
      return this.map(element => element.toString(includeID)).join('');
    };
    array.find = function find(fn) {
      return this.reduce((result, element) => result || element.find(fn), false);
    };
    return array;
  }
  return jsonToElement(json);
}



module.exports = {
  register,
  parse,
  jsonToElement,
  getClass,
};
