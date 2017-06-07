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

This is the more elaborated version of Visual CMS.
It is basically the same old "HTML in a JSON Structure", but with more constraints, 
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

### JSON Structure

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

### Pre-defined Elements

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
 
### Class Documentation

#### Element
##### Properties

- type (String, readonly) 
    - the lowercased Class name, and the identifier used in the `type` property
    of the JSON representation. 
- supportedContent (Array<ElementClass>, readonly)
    - returns an Array of Element classes that are allowed in the default content
    - use getSupportedContent() if you have multiple content blocks 
- settingsSchema (JSON Schema, readonly)
    - returns a JSON Schema for the 'settings' property
- settings (JSON, read/write)
    - custom settings for element instances. Should conform to `settingsSchema`
- content (JSON, read/write)
    - the content of the element
    - either a String (basic Text Element)
    - or an allowed Element (in `supportedContent` Array)
    - or an Array of Elements and Strings
    - or a map of content blocks, each with the above defined content. Each block can
    have constraints to Element types that can be read with `getSupportedContent(property)`
 - template (string, readonly)
    - returns the HTML representation.
    
##### Methods

- Constructor ({ content, settings })
    - expects an Object with `content` and `settings` properties, both optional
- getSupportedContent([property])
    - returns an Array of supported Content Element Classes
    - if `property` is set, it returns the List for the specific content block
- supportsContent(content[, property])
    - returns `true`, if the `content` is allowed, `false` otherwise.
    - if `property` is set, it checks `content` to be allowed in the `property` content block.
- toString()
    - returns `template`
- toJSON()
    - returns the JSON representation of the object.
    
Most of those properties and classes can safely be overridden in custom Elements.

### Subclassing

Example: 
```js
const visualCMS = require ('visual-cms.core');

const {
    Element,
    Text,
    BaseElement,
    PhrasingElement,
    FlowElement,
    Module
} = visualCMS.elements;

class MyElement extends Module {
  get supportedContent() {
    return [
      FlowElement,
    ];
  }

  get template() {
    return `<div class="awesome">${this.content}</div>`;
  }
}

```
The following properties, getter/setter and functions are available for Overriding
in inherited Element Classes:
 
#### constructor({ content, settings}) 
*This should probably not be overridden.*
The constructor expects an object with optional `content` and `settings` properties.
`content` may be Visual CMS Objects, or JSON that will be transformed.
Unallowed content types will be removed, but not fail.
`settings` will throw an error if they do not conform to the allowed JSON Schema.

#### get type()
*This should probably not be overridden.*
The Getter for the `type` property simply returns the Class Name (`this.constructor.name`) lowercased,
this is used in the JSON representations to match a JSON Visual CMS Object to the
correct JavaScript Object.

#### get supportedContent()
The Getter for the `supportedContent` property returns an Array of Classes that the
default content supports. Example: 
```js
get supportedContent() {
  return [ Text, PhrasingElement ];
}
```
This makes Text and all Phrasing Elements valid content elements.

#### getSupportedContent([property])
This function just returns `this.supportedContent` by default.
However, if you support multiple content blocks instead of just the default one,
you can differentiate using the given `property` which content block supports which Content.
Return value should always be an Array of Visual CMS Classes.
Example:
```js
getSupportedContent(property) {
    switch (property) {
    case 'header':
      return [Image];
    case 'column1':
      return [Paragraph];
    default:
      return this.supportedContent;
    }
}
```
This would allow only Image objects as content for `content.header`,
and only Paragraphs inside `content.column1`.
All other content (e.g. `content.column2`, if that exists) returns the
default given from the `supportedContent` Getter.

#### get settingsSchema()
The getter for `settingsSchema` is expected to return a valid JSON Schema.
By default (i.e. as defined in the Getter of the Element Root Class) it is
a Schema that allows an Object type with no additional Properties, i.e. an empty Object.
It is recommended to exactly define desired settings properties and make them required,
and to disallow `additionalProperties`.
Example:
```js
get settingsSchema() {
  return {
    type: 'object',
    properties: {
    columns: {
        type: 'string',
        pattern: '^[1-9][0-9]*(,[1-9][0-9]*)*$',
      },
    },
    required: ['columns'],
    additionalProperties: false,
  };
}
```
#### get template()
This finally returns the HTML that is to be rendered from Objects of your Element Class.
You are free to access `this.settings` and `this.content` to render your favorite HTML module.
Just make sure you return a string that does not contain `undefined` anywhere.
It is recommended to use [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).
Example:
```js
get template() {
if (this.settings.ordered) {
  return `<ol${this.classAttribute}>${this.content}</ol>`;
}
return `<ul${this.classAttribute}>${this.content}</ul>`;
}
```

### API Documentation

### parse(json)
This function expects an JSON representation of Visual CMS Element objects, or an
Array of those objects. It will try to parse them into Element instances (or an 
Array of instances). It will throw an Error if the used types are not known.

### register(...Element)
Use this function when you created custom Elements. It is necessary to
register them with the library so they will be recognized.

