# visual-cms.core

Visual CMS Core Library. By entrecode.

## Basic WYSIWYG

This part of Visual CMS simply translates HTML to a JSON structure with the same information, and back.

### Usage

```js
const vcms = require('visual-cms.core');

const json = {
  type: 'div',
  attributes: { class: 'myclass' },
  content: [
    {
      type: 'h1',
      content: [
        'headline'
      ],
    },
    'a text node',
  ],
};

const html = vcms.toDOM(json);
// Output: <div class="myclass"><h1>headline</h1>a text node</div>

vcms.toJSON(html);
// Output: json equal to the value of `json` above

```
### Schema

The Objects need to conform to the JSON Schema in `./schema/visualcms.json`

## High Level Visual CMS

This is the new shit.
Our goal was to have basically the same "HTML in a JSON Structure", but with more constraints, 
more validation and type inheritance.

All entities in Visual CMS are Elements.
There are basically three types of Elements:

1. Phrasing Elements (cf. [Phrasing Content on MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content))
    - Phrasing Elements are mark-up directly used in text
    - HTML equivalents are e.g. the `<strong>` tag or the `<a>` tag
2. Flow Elements (cf. [Flow Content on MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Flow_content))
    - Flow Elements contain text and phrasing elements
    - HTML equivalents are e.g. the `<p>` tag or the `<ul>` tag
3. Module Elements
    - Higher level Elements, typically composed from Flow Elements and Phrasing Elements
    - usually custom
    - Example: a `<div>`, a slider module, a menubar
    
With Class 1 and Class 2, you can already build basic WYSIWYG text editing (*medium.com-style editor*)

All Elements are JavaScript Classes, inheriting from the base class `Element`.
This structure of heavy Class extending and Inheritance makes it possible to very simply define new,
custom Elements that only change a little aspect of an Element.

Elements usually have one or more content blocks which contain other Elements, and a
number of settings. The Element Class defines which Elements can be contained in the content
blocks, and how the HTML that is rendered from the Element looks like.

A Visual CMS Document is a JSON document that is constructed from Elements. It is the equivalent
to a HTML Document, and can be rendered into HTML, if the used Elements are defined.
Visual CMS Instances (consisting of JavaScript Element Objects) can be rendered into HTML, or in
a JSON structure that can be transformed back into Element Objects.

```
   JSON                     JavaScript                Rendered
Visual CMS     <------>     Visual CMS      ------>     HTML
 Document                    Objects                  Document
```

This means, you can either create a Visual CMS JSON document or directly create Element
instances in JS code. Both can be used to create HTML. The JSON representation can be
written into and read from a database or transferred in other ways.

## JSON Structure

JSON Schema: https://github.com/entrecode/visual-cms.core/blob/master/schema/vcms-base.json

A JSON Visual CMS Document consists of one or multiple Elements. 
An Element always has a type (which maps directly to the defining Class name).
An Element may have a `settings` property which is an Object. An Element Class may
define a JSON Schema for that settings object.
An Element may have a `content` property which defines the content of the element:
Content may either be Text (a JSON String), another Element, or an Array of Elements and Text.
This is the base structure. If the Content is an object, but no Element, it is interpreted
as a Map of multiple content Blocks, identified by their property name. 

Example:

```js
{
  "type": "list",
  "settings": {
    "ordered": false
  },
  "content": [
    {
      "type": "listelement",
      "content": [
        "Lists can contain list elements which become ",
        {
          "type": "strong",
          "content": [
            "li tags"
          ]
        }
      ]
    },
    {
      "type": "list",
      "settings": {
        "ordered": true
      },
      "content": [
        {
          "type": "listelement",
          "content": [
            "or other lists for nesting"
          ]
        }
      ]
    }
  ]
}
```
This would render to:
```html
<ul>
  <li>Lists can contain list elements which become <strong>li tags</strong></li>
  <ol>
    <li>or other lists for nesting</li>
  </ol>
</ul>
```

## Pre-defined Elements

This is the inheritance tree of the basic Element classes:

> *Abstract classes are not to be instantiated, and just for grouping and inheritance.*

- Element (abstract)
    - Text
    - BaseElement (abstract)
      - PhrasingElement (abstract)
        - Link (`<a>`)
        - Code (`<code>`)
        - Emphasis (`<em>`)
        - Strong (`<strong>`)
        - Subscript (`<sub>`)
        - Superscript (`<sup>`)
      - FlowElement (abstract) 
        - Paragraph (`<p>`)
        - Headline (`<h1>`, `<h2>`,…)
        - Image (`<img>`)
        - Quote (`<blockquote>`)
        - List (`<ul>`, `<ol>`)
    - ListElement (`<li>`)
    - Module (abstract)
      - *Your custom module elements*
    
Wonder why `ListElement` is a direct child of `Element`? 
Because it is only allowed inside Lists and not anywhere else where we
would want to allow all `PhrasingElement`s or all `FlowElement`s.

Of course, you are also free to create custom Elements that are no modules,
but inherit from any other Element – e.g. a specialized `ImageWithTitle` Element extending `FlowElement`,
which renders an HTML like `<div><img src="…"><span class="imgTitle">Description</span></div>`.

The base elements support no additional attributes except `class` (which is defined in 
`BaseElement` as a settings parameter). If you really need something else, just create a Child element.
 

