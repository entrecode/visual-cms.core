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
    };
    const html = core.parse(json);
    expect(html.toString()).to.eql(`<ul><li>Lists can contain list elements which become <strong>li tags</strong></li><ol><li>or other lists for nesting</li></ol></ul>`)
    done();
  });
})