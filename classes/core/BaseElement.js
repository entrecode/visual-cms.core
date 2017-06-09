const Element = require('./Element');

/**
 * (Abstract) class for basic HTML elements that support `class` and `title` attributes.
 * @type {BaseElement}
 */
class BaseElement extends Element {

  /**
   * Getter for the JSON schema for the settings object (readonly).
   * BaseElements define the properties `class` (Array of class names) and `title` (string)
   * @returns {JSON} JSON Schema
   */
  get settingsSchema() {
    return {
      type: 'object',
      properties: {
        class: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^[a-zA-Z0-9\\-_]+$',
          },
        },
        title: {
          type: 'string',
        },
      },
      additionalProperties: false,
    };
  }

  /**
   * Getter for a complete class attribute (readonly)
   * @returns {string} ` class="${this.classAttributeValue}"` (with leading space)
   */
  get classAttribute() {
    if (this.classAttributeValue.length > 0) {
      return ` class="${this.classAttributeValue}"`;
    }
    return '';
  }

  /**
   * Getter for a the class attribute value (from `this.settings.class`) (readonly)
   * @returns {string} space-separated class names
   */
  get classAttributeValue() {
    const classArray = this.settings.class;
    if (!classArray || !Array.isArray(classArray) || classArray.length === 0) {
      return '';
    }
    return classArray.join(' ');
  }

  /**
   * Getter for a complete title attribute (readonly)
   * @returns {string} ` class="${this.settings.title}"` (with leading space)
   */
  get titleAttribute() {
    if (this.settings.title) {
      return ` title="${this.settings.title}"`;
    }
    return '';
  }

  /**
   * Additionally to the optional id from the parent class, the `title` and `class` attribute
   * gets rendered here
   * @param {boolean} [includeID] if `true`, elements will get an `data-ec-id` attribute with their
   * @returns {string} attributes for HTML (with leading space)
   */
  getRootElementAttributes(includeID) {
    let attributeString = super.getRootElementAttributes(includeID);
    if (this.settings.title) {
      attributeString += ` title="${this.settings.title}"`;
    }
    if (this.classAttributeValue.length > 0) {
      attributeString += ` class="${this.classAttributeValue}"`;
    }
    return attributeString;
  }


}

module.exports = BaseElement;
