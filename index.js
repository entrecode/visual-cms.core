const toDOM = require('./lib/toDom');
const toJSON = require('./lib/toJSON');
const elements = require('./classes/elements');
const { parse, register } = require('./classes/library');

module.exports = {
  toDOM,
  toJSON,
  parse,
  register,
  elements,
};

