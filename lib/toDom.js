'use strict';
const document = require("min-document");

function toDOM(json) {
  var elem;

  function children(obj, parent) {
    obj.forEach(function(dom) {
      if (typeof dom === 'object') {
        var child = document.createElement(dom.type);
        if (dom.hasOwnProperty('attributes')) {
          Object.keys(dom.attributes).forEach(function(key) {
            child.setAttribute(key, dom.attributes[key]);
          });
        }

        if(dom.hasOwnProperty('content') && dom.content.filter(function(c) { return typeof c === 'object'; }).length)  {
          children(dom.content, child);
        } else {
          child.innerHTML = dom.content;
        }

        parent.appendChild(child);
      } else {
        parent.innerHTML += dom;
      }
    });
  }

  function treeJSON(obj) {
    if (typeof obj.content === 'object' && obj.content !== null) {
      elem = document.createElement(obj.type);
      children(obj.content, elem);

      if (obj.hasOwnProperty('attributes')) {
        Object.keys(obj.attributes).forEach(function(key) {
          elem.setAttribute(key, obj.attributes[key]);
        });
      }
    }
  }

  treeJSON(json);

  return elem.toString() || '';
}



module.exports = toDOM;
