# visual-cms.core

Visual CMS Core Library. By entrecode.

## Usage

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
## Schema

The Objects need to conform to the JSON Schema in `./schema/visualcms.json`
