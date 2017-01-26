const chai = require('chai');

const expect = chai.expect;

describe('toJSON', () => {
  let toJSON;
  let toDom;
  before(() => {
    toJSON = require('../lib/toJSON');
    toDom = require('../lib/toDom');
  });
  it('default case', () => {
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
 </div>`;
    const result = toJSON(testHTML);
    expect(result).to.deep.eql(testJSON);
    const rehtml = toDom(result);
    expect(rehtml).to.eql(testHTML);
  });
  it('mixed inner html and child elements', () => {
    const testJSON = [{
      "type": "div",
      "content": [
        {
          "type": "h1",
          "content": ["headline"]
        },
        "dlskfg"
        ]
    },
      "\n",
      {
        "type": "p",
        "content": [
          "paragraph"
        ]
      }

    ];
    const testHTML = `<div><h1>headline</h1>dlskfg</div>\n<p>paragraph</p>\n`;
    const result = toJSON(testHTML);
    expect(result).to.deep.eql(testJSON);
    const rehtml = toDom(result);
    expect(rehtml+'\n').to.eql(testHTML); // newline at the end is ignored
  });
});
