const BaseElement = require('./BaseElement');
const Element = require('./Element');
/**
 * (Abstract) class for HTML Phrasing elements
 * @type {PhrasingElement}
 */
class PhrasingElement extends BaseElement {

  /**
   * returns the rendered content for usage in the `toString()` method
   * Overriding for Phrasing elements: they need no extraneous <span> around text
   * @param {boolean} [includeID] if `true`, elements will get an `data-ec-id` attribute with their
   *   id
   * @returns {(string|JSON)} Rendered HTML of the contents, or the content blocks object if using
   * content blocks
   */
  getContent(includeID) {
    if (!this.content) {
      return '';
    }
    if (Array.isArray(this.content)) {
      return this.content.map(child => child.toString(includeID)).join('');
    }
    if (typeof this.content === 'string') {
      return this.content;
    }
    if (!(this.content instanceof Element)) {
      return Object.assign(
        {},
        ...Object.keys(this.content)
        .map((key) => {
          if (Array.isArray(this.content[key])) {
            return { [key]: this.content[key].map(element => element.toString(includeID)).join('') };
          }
          return { [key]: this.content[key].toString(includeID) };
        })
      );
    }
    // Overriding for Phrasing elements: they need no extraneous <span> around text
    return this.content.toString(false);
  }

}

module.exports = PhrasingElement;
