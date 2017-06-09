const chai = require('chai');

const core = require('../index');

const { Module, FlowElement, Paragraph } = core.elements;

const expect = chai.expect;

class Grid extends Module {
  get supportedContent() {
    return [
      FlowElement,
    ];
  }

  getSupportedContent(property) {
    switch (property) {
    case 'column1':
      return [Paragraph];
    default:
      return this.supportedContent;
    }
  }

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

  toString(x) {
    const columns = this.settings.columns.split(',')
    .map((columnSize, columnNumber) => `<div class="col-${columnSize}">${this.getContent(x)[`column${columnNumber}`] || ''}</div>`);
    return `<div class="grid">${columns.join('')}</div>`;
  }
}

core.register(Grid);

describe('simple Elements', () => {
  it('simple Text', (done) => {
    const text = new core.elements.Text('test');
    expect(text.template).to.eql('test');
    done();
  });
  it('strong', (done) => {
    const text = new core.elements.Text('test');
    const strong = new core.elements.Strong({ content: text });
    expect(strong.template).to.eql('<strong>test</strong>');
    done();
  });
  it('strong with id in output', (done) => {
    const text = new core.elements.Text('test');
    const strong = new core.elements.Strong({ content: text });
    expect(strong.toStringWithDataID()).to.match(/^<strong data-ec-id="[a-f0-9-]+">test<\/strong>$/);
    done();
  });
  it('strong with array of content', (done) => {
    const text = new core.elements.Text('test');
    const text1 = new core.elements.Text('test2');
    const strong = new core.elements.Strong({ content: [text, text1] });
    expect(strong.template).to.eql('<strong>testtest2</strong>');
    done();
  });
  it('list', (done) => {
    const text = new core.elements.Text('test');
    const text1 = new core.elements.Text('test2');
    const listElement1 = new core.elements.ListElement({ content: text });
    const listElement2 = new core.elements.ListElement({ content: text1 });
    const list = new core.elements.List({
      content: [listElement1, listElement2],
      settings: {
        ordered: true,
      },
    });
    expect(list.toString()).to.eql('<ol><li>test</li><li>test2</li></ol>');
    done();
  });
  it('nested elements with id in output', (done) => {
    const text = new core.elements.Text('test');
    const text1 = new core.elements.Text('test1');
    const strong = new core.elements.Strong({ content: text });
    const p = new core.elements.Paragraph({ content: [strong, text1] });
    expect(p.toStringWithDataID()).to.match(/^<p data-ec-id="[a-f0-9-]+"><strong data-ec-id="[a-f0-9-]+">test<\/strong><span data-ec-id="[a-f0-9-]+">test1<\/span><\/p>$/);
    done();
  });
});

describe('parseJSON', () => {
  it('simple text with strong', (done) => {
    const json = [
      'sdfsdfsdf ',
      {
        type: 'strong',
        content: ['strong'],
      },
      ' sdfsdfsdf',
    ];
    const elements = core.parse(json);
    expect(elements).to.have.lengthOf(3);
    expect(elements[0]).to.be.instanceof(core.elements.Text);
    expect(elements[1]).to.be.instanceof(core.elements.Strong);
    expect(elements[2]).to.be.instanceof(core.elements.Text);
    expect(elements.map(e => e.toString()).join('')).to.eql('sdfsdfsdf <strong>strong</strong> sdfsdfsdf');
    done();
  });
  it('paragraph with class', (done) => {
    const json = [
      'sdfsdfsdf ',
      {
        type: 'paragraph',
        settings: {
          class: ['class1', 'class2'],
        },
        content: [
          'text ',
          {
            type: 'strong',
            settings: {
              class: ['extrastrong'],
            },
            content: 'strong',
          },
        ],
      },
    ];
    const elements = core.parse(json);
    expect(elements).to.have.lengthOf(2);
    expect(elements[0]).to.be.instanceof(core.elements.Text);
    expect(elements[1]).to.be.instanceof(core.elements.Paragraph);
    expect(elements.map(e => e.toString()).join('')).to.eql('sdfsdfsdf <p class="class1 class2">text <strong class="extrastrong">strong</strong></p>');
    done();
  });
  it('parse result array toString is correctly rendered', (done) => {
    const json = [
      'sdfsdfsdf ',
      {
        type: 'paragraph',
        settings: {
          class: ['class1', 'class2'],
        },
        content: [
          'text ',
          {
            type: 'strong',
            settings: {
              class: ['extrastrong'],
            },
            content: 'strong',
          },
        ],
      },
    ];
    const elements = core.parse(json);
    expect(elements).to.have.lengthOf(2);
    expect(elements[0]).to.be.instanceof(core.elements.Text);
    expect(elements[1]).to.be.instanceof(core.elements.Paragraph);
    expect(elements.toString()).to.eql('sdfsdfsdf <p class="class1 class2">text <strong class="extrastrong">strong</strong></p>');
    done();
  });
  it('list', (done) => {
    const json = {
      type: 'list',
      settings: {
        ordered: false,
      },
      content: [
        {
          type: 'listelement',
          content: [
            'Lists can contain list elements which become ',
            {
              type: 'strong',
              content: [
                'li tags',
              ],
            },
          ],
        },
        {
          type: 'listelement',
          content: [
            {
              type: 'list',
              settings: {
                ordered: true,
              },
              content: [
                {
                  type: 'listelement',
                  content: [
                    'or other lists for nesting',
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const html = core.parse(json);
    expect(html.toString()).to.eql('<ul><li>Lists can contain list elements which become <strong>li tags</strong></li><li><ol><li>or other lists for nesting</li></ol></li></ul>');
    done();
  });
  it('list toJSON', (done) => {
    const json = {
      type: 'list',
      settings: {
        ordered: false,
      },
      content: [
        {
          type: 'listelement',
          content: [
            'Lists can contain list elements which become ',
            {
              type: 'strong',
              content: [
                'li tags',
              ],
            },
          ],
        },
        {
          type: 'listelement',
          content: [
            {
              type: 'list',
              settings: {
                ordered: true,
              },
              content: [
                {
                  type: 'listelement',
                  content: [
                    'or other lists for nesting',
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const html = core.parse(json);
    expect(html.toJSON()).to.deep.eql(json);
    done();
  });
  it('link', (done) => {
    const json = [
      {
        type: 'link',
        settings: {
          href: 'https://entrecode.de',
          newTab: true,
          rel: ['nofollow'],
          class: ['awesome'],
        },
        content: [
          'The link',
        ],
      },
    ];
    const [html] = core.parse(json);
    expect(html.toString()).to.eql('<a href="https://entrecode.de" target="_blank" rel="nofollow" class="awesome">The link</a>');
    expect([html.toJSON()]).to.deep.eql(json);
    done();
  });
  it('grid custom module', (done) => {
    const json = {
      type: 'grid',
      settings: {
        columns: '4,8',
      },
      content: {
        column0: [
          {
            type: 'paragraph',
            content: [
              'First ',
              {
                type: 'strong',
                content: 'paragraph!',
              },
            ],
          },
          {
            type: 'paragraph',
            content: 'Second paragraph!',
          }],
        column1: {
          type: 'paragraph',
          content: 'just text',
        },
      },
    };
    const html = core.parse(json);
    expect(html.toString()).to.eql('<div class="grid"><div class="col-4"><p>First <strong>paragraph!</strong></p><p>Second paragraph!</p></div><div class="col-8"><p>just text</p></div></div>');
    done();
  });
  it('grid toJSON', (done) => {
    const json = {
      type: 'grid',
      settings: {
        columns: '4,8',
      },
      content: {
        column0: [
          {
            type: 'paragraph',
            content: [
              'First ',
              {
                type: 'strong',
                content: 'paragraph!',
              },
            ],
          },
          {
            type: 'paragraph',
            content: 'Second paragraph!',
          }],
        column1: {
          type: 'paragraph',
          content: 'just text',
        },
      },
    };
    const html = core.parse(json);
    expect(html.toJSON()).to.deep.eql(json);
    done();
  });
  it('settings schema error', (done) => {
    const json = {
      type: 'grid',
      settings: {
        columns: 'lol',
      },
      content: {},
    };
    expect(() => core.parse(json)).to.throw(/^invalid settings: {"error":{"message":"String does not match pattern/);
    done();
  });
  it('unknown types in parse', (done) => {
    const json = {
      type: 'unknown',
      content: {},
    };
    expect(() => core.parse(json)).to.throw(/Class 'unknown' not found/);
    done();
  });
  it('unknown types in jsonToElement', (done) => {
    const json = {
      type: 'paragraph',
      content: {
        type: 'unknown',
        content: {},
      },
    };
    expect(() => core.parse(json)).to.throw(/Class 'unknown' not found/);
    done();
  });
});

describe('base elements', () => {
  it('block', (done) => {
    const json = {
      type: 'block',
      content: [
        {
          type: 'paragraph',
          content: [
            'Text. ',
            {
              type: 'link',
              settings: {
                href: 'https://entrecode.de',
                newTab: true,
                rel: ['nofollow'],
                class: ['awesome'],
              },
              content: [
                'The link',
              ],
            },
            {
              type: 'code',
              content: 'lol',
            },
            {
              type: 'emphasis',
              content: 'em',
            },
          ],
        },
        {
          type: 'headline',
          settings: {
            level: 2,
          },
          content: [
            {
              type: 'strong',
              content: 'strong in head',
            },
            {
              type: 'subscript',
              content: 'sub',
            },
            {
              type: 'superscript',
              content: 'sup',
            },
          ],
        },
      ],
    };
    const html = core.parse(json);
    expect(html.toString()).to.eql('<div><p>Text. \
<a href="https://entrecode.de" target="_blank" rel="nofollow" class="awesome">The link</a>\
<code>lol</code>\
<em>em</em>\
</p>\
<h2>\
<strong>strong in head</strong>\
<sub>sub</sub>\
<sup>sup</sup>\
</h2></div>');
    expect(html.toJSON()).to.deep.eql(json);
    done();
  });
  it('asmuchaspossibleinonejson', (done) => {
    const json = [
      {
        type: 'paragraph',
        content: [
          'Text. ',
          {
            type: 'link',
            settings: {
              href: 'https://entrecode.de',
              newTab: true,
              rel: ['nofollow'],
              class: ['awesome'],
            },
            content: [
              'The link',
            ],
          },
          {
            type: 'code',
            content: 'lol',
          },
          {
            type: 'emphasis',
            content: 'em',
          },
        ],
      },
      {
        type: 'headline',
        settings: {
          level: 2,
        },
        content: [
          {
            type: 'strong',
            content: 'strong in head',
          },
          {
            type: 'subscript',
            content: 'sub',
          },
          {
            type: 'superscript',
            content: 'sup',
          },
        ],
      },
      {
        type: 'quote',
        content: [
          'cited ',
          {
            type: 'link',
            settings: {
              href: 'http://entrecode.de',
            },
            content: 'simple link',
          },
        ],
      },
    ];
    const html = core.parse(json);
    expect(html.map(e => e.toString()).join('')).to.eql('<p>Text. \
<a href="https://entrecode.de" target="_blank" rel="nofollow" class="awesome">The link</a>\
<code>lol</code>\
<em>em</em>\
</p>\
<h2>\
<strong>strong in head</strong>\
<sub>sub</sub>\
<sup>sup</sup>\
</h2>\
<blockquote>cited <a href="http://entrecode.de">simple link</a></blockquote>');
    expect(html.map(e => e.toJSON())).to.deep.eql(json);
    done();
  });
  describe('image tags', () => {
    it('simple image', (done) => {
      const json = [
        {
          type: 'image',
          settings: {
            src: 'https://entreco.de/image.png',
            alt: 'simple image',
          },
        },
      ];
      const html = core.parse(json);
      expect(html.map(e => e.toString()).join('')).to.eql('\
<img src="https://entreco.de/image.png" alt="simple image">');
      expect(html.map(e => e.toJSON())).to.deep.eql(json);
      done();
    });

    it('image with properties, simple link', (done) => {
      const json = [
        {
          type: 'image',
          settings: {
            src: 'https://entreco.de/image.png',
            alt: 'simple image',
            height: 100,
            width: 200,
            href: 'https://entrecode.de',
            class: ['awesome'],
            title: 'whaaaat',
          },
        },
      ];
      const html = core.parse(json);
      expect(html.map(e => e.toString()).join('')).to.eql('\
<a href="https://entrecode.de" title="whaaaat" class="awesome">\
<img src="https://entreco.de/image.png" alt="simple image" width="200" height="100">\
</a>');
      expect(html.map(e => e.toJSON())).to.deep.eql(json);
      done();
    });

    it('image with properties, link, in wrapper', (done) => {
      const json = [
        {
          type: 'image',
          settings: {
            src: 'https://entreco.de/image.png',
            alt: 'simple image',
            href: 'https://entrecode.de',
            rel: ['nofollow'],
            newTab: true,
            class: ['awesome'],
            title: 'whaaaat',
            wrap: true,
          },
        },
      ];
      const html = core.parse(json);
      expect(html.map(e => e.toString()).join('')).to.eql('\
<div title="whaaaat" class="awesome">\
<a href="https://entrecode.de" target="_blank" rel="nofollow">\
<img src="https://entreco.de/image.png" alt="simple image">\
</a></div>');
      expect(html.map(e => e.toJSON())).to.deep.eql(json);
      done();
    });

    it('responsive image', (done) => {
      const json = [
        {
          type: 'image',
          settings: {
            src: 'https://entreco.de/image.png',
            alt: 'simple image',
            class: ['awesome'],
            title: 'whaaaat',
            wrap: false,
            responsive: {
              srcs: {
                '500w': 'https://entreco.de/image-500.png',
                '800w': 'https://entreco.de/image-800.png',
                '2x': 'https://entreco.de/image-2x.png',
              },
              sizes: {
                default: '500w',
                '(min-width: 400px)': '800w',
              },
            },
          },
        },
      ];
      const html = core.parse(json);
      expect(html.map(e => e.toString()).join('')).to.eql('\
<img src="https://entreco.de/image.png" alt="simple image"\
 srcset="https://entreco.de/image-500.png 500w, https://entreco.de/image-800.png 800w, https://entreco.de/image-2x.png 2x"\
 sizes="(min-width: 400px) 800w, 500w"\
 title="whaaaat" class="awesome">');
      expect(html.map(e => e.toJSON())).to.deep.eql(json);
      done();
    });
    it('responsive image without sizes', (done) => {
      const json = [
        {
          type: 'image',
          settings: {
            src: 'https://entreco.de/image.png',
            alt: 'simple image',
            class: ['awesome'],
            title: 'whaaaat',
            wrap: true,
            responsive: {
              srcs: {
                '500w': 'https://entreco.de/image-500.png',
                '800w': 'https://entreco.de/image-800.png',
                '2x': 'https://entreco.de/image-2x.png',
              },
            },
          },
        },
      ];
      const html = core.parse(json);
      expect(html.map(e => e.toString()).join('')).to.eql('\
<div title="whaaaat" class="awesome">\
<img src="https://entreco.de/image.png" alt="simple image"\
 srcset="https://entreco.de/image-500.png 500w, https://entreco.de/image-800.png 800w, https://entreco.de/image-2x.png 2x"\
></div>');
      expect(html.map(e => e.toJSON())).to.deep.eql(json);
      done();
    });
  });
});

describe('find', () => {
  const json = {
    type: 'block',
    content: [
      {
        type: 'paragraph',
        content: [
          'Text. ',
          {
            type: 'link',
            settings: {
              href: 'https://entrecode.de',
              newTab: true,
              rel: ['nofollow'],
              class: ['awesome'],
            },
            content: [
              'The link',
            ],
          },
          {
            type: 'code',
            content: 'lol',
          },
          {
            type: 'emphasis',
            content: 'em',
          },
        ],
      },
      {
        type: 'headline',
        settings: {
          level: 2,
        },
        content: [
          {
            type: 'strong',
            content: 'strong in head',
          },
          {
            type: 'subscript',
            content: 'sub',
          },
          {
            type: 'superscript',
            content: 'sup',
          },
        ],
      },
    ],
  };
  const json2 =
    {
      type: 'grid',
      settings: {
        columns: '4,8',
      },
      content: {
        column0: [
          {
            type: 'paragraph',
            content: [
              'First ',
              {
                type: 'strong',
                content: 'paragraph!',
              },
            ],
          },
          {
            type: 'paragraph',
            content: 'Second paragraph!',
          }],
        column1: {
          type: 'paragraph',
          content: 'just text',
        },
      },
    };
  const list = [json, json2];
  it('find by content on object', (done) => {
    const ecvc = core.parse(json);
    const found = ecvc.find(el => el.content.toString() === 'sub');
    expect(found, 'did not find object').to.be.ok;
    expect(found.type).to.eql('subscript');
    done();
  });
  it('find by content on array', (done) => {
    const ecvc = core.parse(list);
    const found = ecvc.find(el => el.content.toString() === 'sub');
    expect(found, 'did not find object').to.be.ok;
    expect(found.type).to.eql('subscript');
    done();
  });
  it('find by type on object', (done) => {
    const ecvc = core.parse(json);
    const found = ecvc.find(el => el.type === 'emphasis');
    expect(found, 'did not find object').to.be.ok;
    expect(found.content.toString()).to.eql('em');
    done();
  });
  it('find by type on array', (done) => {
    const ecvc = core.parse(list);
    const found = ecvc.find(el => el.type === 'emphasis');
    expect(found, 'did not find object').to.be.ok;
    expect(found.content.toString()).to.eql('em');
    done();
  });
  it('no match on object', (done) => {
    const ecvc = core.parse(json);
    const found = ecvc.find(el => el.type === 'emfphasis');
    expect(found, 'did find object').to.be.false;
    done();
  });
  it('no match on array', (done) => {
    const ecvc = core.parse(list);
    const found = ecvc.find(el => el.type === 'emfphasis');
    expect(found, 'did find object').to.be.false;
    done();
  });
  it('find in subtree with object-type contents on object', (done) => {
    const ecvc = core.parse(json2);
    const found = ecvc.find(el => el.content.toString() === 'Second paragraph!');
    expect(found, 'did not find object').to.be.ok;
    expect(found.type).to.eql('paragraph');
    done();
  });
  it('find in subtree with object-type contents on array', (done) => {
    const ecvc = core.parse(list);
    const found = ecvc.find(el => el.content.toString() === 'Second paragraph!');
    expect(found, 'did not find object').to.be.ok;
    expect(found.type).to.eql('paragraph');
    done();
  });
});
