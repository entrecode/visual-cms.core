const toDOM = require('./lib/toDom');
const toJSON = require('./lib/toJSON');
const elements = require('./classes/elements');
const { parse, register, getClass } = require('./classes/library');

module.exports = {
  toDOM,
  toJSON,
  parse,
  register,
  getClass,
  elements,
};

