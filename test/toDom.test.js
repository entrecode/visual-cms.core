'use strict';
const chai = require('chai');

const expect = chai.expect;

describe('toDom', () => {
  let toDom;
  before(() => {
    toDom = require('../lib/toDom');
  });
  it('default case', () => {
 //   const testJSON = '{"type":"div","content":["\n ",{"type":"h2","content":["test"],"attributes":{"style":"color: red;"}},"\n ",{"type":"p","content":["asklfj sadklfjö asföl alföka flkas dfklöask fdlöasfk ölsak fsafasflkdlf sklöfk sdlf ksdlöf sdlf"]},"\n ",{"type":"h3","content":["test"]},"\n ",{"type":"h4","content":["test"]},"\n ",{"type":"img","attributes":{"src":"http://p-hold.com/200"}},"\n ",{"type":"div","content":["\n ",{"type":"blockquote","content":["TEST"]},"\n "]},"\n "],"attributes":{"class":"content"}}';
    const testJSON = {
      "type": "div",
      "content": [
        "\n ",
        {
          "type": "h2",
          "content": [
            "test"
          ],
          "attributes": {
            "style": "color: red;"
          }
        },
        "\n ",
        {
          "type": "p",
          "content": [
            "asklfj sadklfjö asföl alföka flkas dfklöask fdlöasfk ölsak fsafasflkdlf sklöfk sdlf ksdlöf sdlf"
          ]
        },
        "\n ",
        {
          "type": "h3",
          "content": [
            "test"
          ]
        },
        "\n ",
        {
          "type": "h4",
          "content": [
            "test"
          ]
        },
        "\n ",
        {
          "type": "img",
          "attributes": {
            "src": "http://p-hold.com/200"
          }
        },
        "\n ",
        {
          "type": "div",
          "content": [
            "\n ",
            {
              "type": "blockquote",
              "content": [
                "TEST"
              ]
            },
            "\n "
          ]
        },
        "\n "
      ],
      "attributes": {
        "class": "content"
      }
    }
;
    const testHTML = `<div class="content"><h2 style="color: red;">test</h2><p>asklfj sadklfjö asföl alföka flkas dfklöask fdlöasfk ölsak fsafasflkdlf sklöfk sdlf ksdlöf sdlf</p><h3>test</h3><h4>test</h4><img src="http://p-hold.com/200" /><div><blockquote>TEST</blockquote></div></div>`;
    const result = toDom((testJSON));
    expect(result).to.eql(testHTML);
  });
});
