const { FlowElement, PhrasingElement, Text } = require('../core');

class Image extends FlowElement {

  get settingsSchema() {
    const schema = super.settingsSchema;
    Object.assign(schema.properties, {
      src: {
        type: 'string',
        format: 'uri',
      },
      alt: {
        type: 'string',
      },
      height: {
        type: 'integer',
        minimum: 0,
      },
      width: {
        type: 'integer',
        minimum: 0,
      },
      responsive: {
        type: 'object',
        properties: {
          srcs: {
            type: 'object',
            patternProperties: {
              '^[0-9]+(w|.[0-9]+x|x)$': {
                type: 'string',
                format: 'uri',
              },
            },
          },
          sizes: {
            type: 'object',
            properties: {
              default: {
                type: 'string',
                pattern: '^[0-9]+w',
              },
              patternProperties: {
                '^\([0-9a-z :-()]+\)$': {
                  type: 'string',
                  pattern: '^[0-9]+w',
                },
              },
            },
            required: ['default'],
          },
        },
        required: ['srcs'],
      },
      href: {
        type: 'string',
        format: 'uri',
      },
      newTab: {
        type: 'boolean',
      },
      rel: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      wrap: {
        type: 'boolean',
      }
    });
    Object.assign(schema, {
      required: ['src', 'alt'],
      dependencies: {
        newTab: ['href'],
        rel: ['href'],
      },
    });
    return schema;
  }

  toString(includeID) {
    const widthAttribute = this.settings.width ? ` width="${this.settings.width}"` : '';
    const heightAttribute = this.settings.height ? ` height="${this.settings.height}"` : '';
    let srcSet = '';
    if (this.settings.responsive) {
      const srcSetValues = Object.keys(this.settings.responsive.srcs)
      .map(descriptor => `${this.settings.responsive.srcs[descriptor]} ${descriptor}`)
      .join(', ');
      srcSet = ` srcset="${srcSetValues}"`;
      let sizes = '';
      if (this.settings.responsive.sizes) {
        sizes = Object.keys(this.settings.responsive.sizes)
        .filter(mediaCondition => mediaCondition !== 'default')
        .map(mediaCondition => `${mediaCondition} ${this.settings.responsive.sizes[mediaCondition]}`);
        sizes.push(this.settings.responsive.sizes.default);
        sizes = ` sizes="${sizes.join(', ')}"`;
      }
      srcSet += sizes;
    }
    const imageAttributes = `\
 src="${this.settings.src}"\
 alt="${this.settings.alt}"\
${widthAttribute}\
${heightAttribute}\
${srcSet}\
`;
    let aAttributes = '';
    if (this.settings.href) {
      let rel = '';
      if (this.settings.rel && Array.isArray(this.settings.rel) && this.settings.rel.length > 0) {
        rel = ` rel="${this.settings.rel.join(' ')}"`;
      }
      aAttributes = ` href="${this.settings.href}"\
${this.settings.newTab ? ' target="_blank"' : ''}\
${rel}\
`;
    }
    let html = '';
    if (this.settings.wrap) {
      html = `<div${this.getRootElementAttributes(includeID)}>`;
      if (this.settings.href) {
        html += `<a${aAttributes}><img${imageAttributes}></a>`;
      } else {
        html += `<img${imageAttributes}>`;
      }
      html += '</div>';
      return html;
    }
    if (this.settings.href) {
      html += `<a${aAttributes}${this.getRootElementAttributes(includeID)}><img${imageAttributes}></a>`;
    } else {
      html += `<img${imageAttributes}${this.getRootElementAttributes(includeID)}>`;
    }
    return html;
  }
}

module.exports = Image;
