'use strict';

const document = require('min-document');

function buildDOM(json) {
  const element = document.createElement(json.type);

  if ('attributes' in json) {
    Object.keys(json.attributes).forEach((key) => {
      element.setAttribute(key, json.attributes[key]);
    });
  }

  if (!('content' in json)) {
    return element;
  }

  json.content.forEach((dom) => {
    if (typeof dom === 'object') {
      element.appendChild(buildDOM(dom));
    } else {
      element.innerHTML = (element.innerHTML || '') + dom;
    }
  });

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
