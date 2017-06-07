const { Element, Text, Strong, List, ListElement, Paragraph } = require('./elements');

const library = new Map();

library.set('element', Element);
library.set('text', Text);
library.set('strong', Strong);
library.set('list', List);
library.set('listelement', ListElement);
library.set('paragraph', Paragraph);

const abstractTypes = ['baseelement', 'phrasingelement', 'flowelement', 'module'];

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

function parse(json) {
  if (Array.isArray(json)) {
    const array = json.map(contentPart => parse(contentPart));
    array.toString = function toString() {
      return this.map(element => element.toString()).join('');
    };
    return array;
  }
  const type = typeof json === 'string' ? 'text' : json.type;
  const Class = library.get(type);
  if (!Class) {
    throw new Error(`Class '${type}' not found`);
  }
  return new Class(json);
}

function jsonToElement(json) {
  if (json instanceof library.get('element')) {
    return json;
  }
  const type = typeof json === 'string' ? 'text' : json.type;
  const Class = library.get(type);
  if (!Class) {
    throw new Error(`Class '${type}' not found`);
  }
  return new Class(json);
}

module.exports = {
  register,
  parse,
  jsonToElement,
};
