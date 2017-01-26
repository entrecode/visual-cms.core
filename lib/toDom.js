'use strict';

const document = require('min-document');

function buildDOM(json) {
  if (typeof json !== 'object') {
    return document.createTextNode(json);
  }

  if (Array.isArray(json)) {
    return json.map(buildDOM).join('');
  }

  const element = document.createElement(json.type);

  if ('attributes' in json) {
    Object.keys(json.attributes).forEach((key) => {
      element.setAttribute(key, json.attributes[key]);
    });
  }

  if ('content' in json) {
    json.content.forEach(dom => element.appendChild(buildDOM(dom)));
  }

  return element;
}

/**
 * Builds a DOM tree from a JSON object and returns it as string
 * @param json a visual CMS JSON Tree (including type property and optional attributes and content)
 * @returns {string} the parsed string
 */
function toDOM(json) {
  return buildDOM(json).toString();
}

module.exports = toDOM;
