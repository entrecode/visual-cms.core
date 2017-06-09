const { FlowElement, PhrasingElement, Text } = require('../core');

/**
 * A HTML `<img>` tag. Subclass of `FlowElement`. Has no content.
 * Depending on the properties, it is wrapped in an `<a>` tag or even an `<div>`.
 * It also has settings options for responsive image variants using `src-set`.
 * @type {Image}
 * @example <caption>Simple Image:</caption>
 * new Image({
 *   settings: {
 *     src: 'https://example.com/image.jpg',
 *     alt: 'The alt attribute is always required',
 *     title: 'The title attribute is inferred from BaseElement',
 *     width: 100, // width and height are optional
 *     height: 200,
 *   }
 * });
 * @example <caption>Resulting HTML (`alt` and `title` values omitted for brevity):</caption>
 * <img src="https://example.com/image.jpg" alt="…" title="…" width="100" height="200">
 * @example <caption>Responsive Image:</caption>
 * new Image({
 *   settings: {
 *     src: 'https://entreco.de/image.png',
 *     alt: 'simple image',
 *     class: ['awesome'],
 *     title: 'whaaaat',
 *     responsive: {
 *       srcs: {
 *         '500w': 'https://entreco.de/image-500.png',
 *         '800w': 'https://entreco.de/image-800.png',
 *         '2x': 'https://entreco.de/image-2x.png',
 *       },
 *       sizes: {
 *         default: '500w',
 *         '(min-width: 400px)': '800w',
 *       },
 *     },
 *   },
 * });
 * @example <caption>Resulting HTML:</caption>
 * <img src="https://entreco.de/image.png" alt="simple image"
 * srcset="https://entreco.de/image-500.png 500w, https://entreco.de/image-800.png 800w, https://entreco.de/image-2x.png 2x"
 * sizes="(min-width: 400px) 800w, 500w"
 * title="whaaaat" class="awesome">
 * @example <caption>Image with Link:</caption>
 * new Image({
 *   settings: {
 *     src: 'https://example.com/image.jpg',
 *     alt: 'The alt attribute is always required',
 *     title: 'The title attribute is inferred from BaseElement',
 *     href: 'https://entrecode.de',
 *     rel: ['nofollow'],
 *     newTab: true,
 *   }
 * });
 * @example <caption>Resulting HTML (`alt` and `title` values omitted for brevity):</caption>
 * <a href="https://entrecode.de" target="_blank" rel="nofollow">
 *   <img src="https://example.com/image.jpg" alt="…" title="…">
 * </a>
 * @example <caption>Wrapped Image:</caption>
 * new Image({
 *   settings: {
 *     src: 'https://example.com/image.jpg',
 *     alt: 'description',
 *     class: ['awesome'],
 *     wrap: true,
 *   }
 * });
 * @example <caption>Resulting HTML (note that the `class` attribute is rendered on the outermost element):</caption>
 * <div class="awesome"><img src="https://example.com/image.jpg" alt="description"></div>
 */
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
