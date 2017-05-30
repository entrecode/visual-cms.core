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
    const strong = new core.elements.Strong({content: text});
    expect(strong.template).to.eql('<strong>test</strong>');
    done();
  });
  it('strong with array of content', (done) => {
    const text = new core.elements.Text('test');
    const text1 = new core.elements.Text('test2');
    const strong = new core.elements.Strong({content: [text, text1]});
    expect(strong.template).to.eql('<strong>testtest2</strong>');
    done();
  });
});

describe('parseJSON', () => {
  it('parse', (done) => {
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
})