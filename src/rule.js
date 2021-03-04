const MATCH_ALL = /[\s\S]*/
class Rule {
  constructor ({ id, type, selector, multiple = false, defaultValue = '', regex = MATCH_ALL }) {
    this.id = id
    this.type = type
    this.selector = selector
    this.multiple = multiple
    this.defaultValue = defaultValue
    this.regex = regex
  }

  select (element, notFound = {}) {
    return (this.selector === '__self'
      ? element
      : element.querySelector(this.selector)) || notFound
  }

  getData (element) {
    const data = this._getData(element)
    if (typeof data.match === 'function') {
      return (data.match(this.regex) || [])[0] || this.defaultValue
    }
    return data
  }

  _getData (element) {
    throw Error("This method should be implemented by Rule's subclasses")
  }
}

class TextRule extends Rule {
  constructor ({ id, selector, multiple, defaultValue = '', regex }) {
    super({ id, selector, multiple, defaultValue, regex, type: 'text' })
  }

  _getData (element) {
    try {
      return this.select(element, { textContent: this.defaultValue }).textContent.trim()
    } catch {
      console.log(element)
    }
  }
}

class AttributeRule extends Rule {
  constructor ({ id, selector, multiple, defaultValue, regex, attributeName }) {
    super({ id, selector, multiple, defaultValue, regex, type: 'attribute' })
    this.attributeName = attributeName
  }

  _getData (element) {
    return this.select(element, {
      getAttribute: (_) => this.defaultValue
    }).getAttribute(this.attributeName)
  }
}

class ElementRule extends Rule {
  constructor ({ id, selector, multiple, defaultValue, children = [] }) {
    super({ id, selector, multiple, defaultValue, type: 'element' })
    this.children = children
  }

  _getData (element) {
    const data = this.children.reduce((elements, current) => ({
      ...elements,
      [current.id]: current.getData(this.select(element, null))
    }), {})
    return Object.keys(data).length > 0
      ? data
      : this.defaultValue
  }
}

class ElementsRule extends Rule {
  constructor ({ id, selector, multiple, defaultValue, children = [] }) {
    super({ id, selector, multiple, defaultValue, type: 'elements' })
    this.children = children
  }

  select (element) {
    return (this.selector === '__self'
      ? element
      : element.querySelectorAll(this.selector)) || null
  }

  _getData (element) {
    const data = Array.from(this.select(element)).map(el =>
      this.children.reduce((acc, current) => ({
        ...acc,
        [current.id]: current.getData(el)
      }), {}))
    return data.length > 0 ? data : this.defaultValue
  }
}

module.exports = { TextRule, AttributeRule, ElementRule, ElementsRule }
