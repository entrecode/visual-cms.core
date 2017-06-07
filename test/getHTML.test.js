const chai = require('chai');

const core = require('../classes/Core');

const expect = chai.expect;

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
      }
    });
    expect(list.toString()).to.eql('<ol><li>test</li><li>test2</li></ol>');
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
      ' sdfsdfsdf'
    ];
    const elements = core.parse(json);
    expect(elements).to.have.lengthOf(3);
    expect(elements[0]).to.be.instanceof(core.elements.Text);
    expect(elements[1]).to.be.instanceof(core.elements.Strong);
    expect(elements[2]).to.be.instanceof(core.elements.Text);
    expect(elements.map(e => e.toString()).join('')).to.eql('sdfsdfsdf <strong>strong</strong> sdfsdfsdf')
    done();
  });
  it('paragraph with class', (done) => {
    const json = [
      'sdfsdfsdf ',
      {
        type: 'paragraph',
        settings: {
          class: ['class1', 'class2']
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
          class: ['class1', 'class2']
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
                'li tags'
              ]
            }
          ]
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
                    'or other lists for nesting'
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    const html = core.parse(json);
    expect(html.toString()).to.eql(`<ul><li>Lists can contain list elements which become <strong>li tags</strong></li><li><ol><li>or other lists for nesting</li></ol></li></ul>`)
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
                'li tags'
              ]
            }
          ]
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
                    'or other lists for nesting'
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    const html = core.parse(json);
    expect(html.toJSON()).to.deep.eql(json);
    done();
  });
  it('grid custom module', (done) => {
    const json = {
      type: 'grid',
      settings: {
        columns: '4,8'
      },
      content: {
        column0: [
          {
            type: 'paragraph',
            content: [
              'First ',
              {
                type: 'strong',
                content: 'paragraph!'
              }
            ]
          },
          {
            type: 'paragraph',
            content: 'Second paragraph!'
          }],
        column1: {
          type: 'paragraph',
          content: 'just text'
        }
      }
    };
    const html = core.parse(json);
    expect(html.toString()).to.eql(`<div class="grid"><div class="col-4"><p>First <strong>paragraph!</strong></p><p>Second paragraph!</p></div><div class="col-8"><p>just text</p></div></div>`);
    done();
  });
  it('grid toJSON', (done) => {
    const json = {
      type: 'grid',
      settings: {
        columns: '4,8'
      },
      content: {
        column0: [
          {
            type: 'paragraph',
            content: [
              'First ',
              {
                type: 'strong',
                content: 'paragraph!'
              }
            ]
          },
          {
            type: 'paragraph',
            content: 'Second paragraph!'
          }],
        column1: {
          type: 'paragraph',
          content: 'just text'
        }
      }
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
        content: {}
      },
    };
    expect(() => core.parse(json)).to.throw(/Class 'unknown' not found/);
    done();
  });
});
