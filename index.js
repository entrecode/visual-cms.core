const toDOM = require('./lib/toDom');
const toJSON = require('./lib/toJSON');
const elements = require('./classes/elements');
const { parse, register, getClass } = require('./classes/library');

/**
 * Visual CMS Core module
 * @module visual-cms.core
 * @name vcms
 * @example const vcms = require('visual-cms.core');
 */
module.exports = {
  toDOM,
  toJSON,
  parse,
  register,
  getClass,
  /**
   * elements contains all predefined Classes, e.g. `elements.Element`
   * @name vcms.elements
   * @example vcms.elements.Element
   */
  elements,
};

