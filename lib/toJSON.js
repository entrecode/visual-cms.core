const DOMParser = require('xmldom').DOMParser;

/**
 * Transforms a DOM tree into JSON
 * @param node a DOM element
 * @returns json
 */
function toJSON(node) {
  if (typeof node !== 'object') { // input is a string, we have to parse it first
    const parsed = new DOMParser().parseFromString(node, 'text/html');
    if (Array.from(parsed.childNodes).length === 1) { // single node, return object
      return toJSON(parsed.childNodes[0]);
    }
    return Array.from(parsed.childNodes).map(toJSON).filter(x => !!x); // multiple nodes, return array
  }

  if (node.nodeType === 3) { // text node
    if (/^\s+$/.test(node.nodeValue)) {
      return null; // ignore text nodes with only whitespace
    }
    return node.nodeValue;
  }
  if (node.nodeType === 8) { // comment node
    return null;
  }
  return [ // element node
    { key: 'type', value: node.localName }, // element type
    { key: 'content', value: Array.from(node.childNodes).map(toJSON).filter(x => !!x) }, // element contents
    {
      key: 'attributes', // element attributes
      value: Array.from(node.attributes)
      .map(attr => ({ [attr.localName]: attr.nodeValue }))
      .reduce((a, b) => Object.assign(a, b), {}),
    },
  ] // remove empty content/attributes
  .filter(o => o.value.length > 0 || Object.keys(o.value).length > 0)
  .reduce((r, e) => Object.assign(r, { [e.key]: e.value }), {}); // build return object
}

module.exports = toJSON;
