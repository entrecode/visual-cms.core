'use strict';
const chai = require('chai');

const expect = chai.expect;

describe('toDom', () => {
  let toJSON;
  let toDOM;
  before(() => {
    toJSON = require('../lib/toJSON');
    toDOM = require('../lib/toDom');
  });
  it('default case', () => {
    const testJSON = {
      "type": "div",
      "content": [

        {
          "type": "h2",
          "content": [
            "test"
          ],
          "attributes": {
            "style": "color: red;"
          }
        },

        {
          "type": "p",
          "content": [
            "asklfj sadklfjö asföl alföka flkas dfklöask fdlöasfk ölsak fsafasflkdlf sklöfk sdlf ksdlöf sdlf"
          ]
        },

        {
          "type": "h3",
          "content": [
            "test"
          ]
        },

        {
          "type": "h4",
          "content": [
            "test"
          ]
        },

        {
          "type": "img",
          "attributes": {
            "src": "http://p-hold.com/200"
          }
        },

        {
          "type": "div",
          "content": [
            {
              "type": "blockquote",
              "content": [
                "TEST"
              ]
            }
          ]
        }
      ],
      "attributes": {
        "class": "content"
      }
    };
    const testHTML = `<div class="content">
<h2 style="color: red;">test</h2>
<p>asklfj sadklfjö asföl alföka flkas dfklöask fdlöasfk ölsak fsafasflkdlf sklöfk sdlf ksdlöf sdlf</p>
<h3>test</h3>
<h4>test</h4>
<img src="http://p-hold.com/200" />
<div>
<blockquote>TEST</blockquote>
</div>
</div>`.replace(/\n|\r/g, '');
    const result = toDOM(testJSON);
    expect(result).to.eql(testHTML);
    const rejson = toJSON(result);
    expect(rejson).to.deep.eql(testJSON);
  });
  it('mixed inner html and child elements', () => {
    const testJSON = {
      "type": "div",
      "content": [
        {
          "type": "h1",
          "content": ["headline"]
        },
        "dlskfg",
        ]
    };
    const testHTML = `<div><h1>headline</h1>dlskfg</div>`;
    const result = toDOM(testJSON);
    expect(result).to.eql(testHTML);
    const rejson = toJSON(result);
    expect(rejson).to.deep.eql(testJSON);
  });
  it('undefined', (done) => {
    const result = toDOM(undefined);
    expect(result).to.eql('')
    done();
  });
  it('null', (done) => {
    const result = toDOM(null);
    expect(result).to.eql('')
    done();
  });
  it('empty object', (done) => {
    const result = toDOM({});
    expect(result).to.eql('')
    done();
  });
});
