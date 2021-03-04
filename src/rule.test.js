const Parser = require('./DOMParser')
const { TextRule, AttributeRule, ElementRule, ElementsRule } = require('./rule')

describe('TextRule', () => {
  const element = new Parser('<p><span>Hello 123</span></p>').window.document

  describe('when there is no regex', () => {
    it('extracts text content from a dom node', () => {
      const rule = new TextRule({ id: 'id', selector: 'p > span' })
      expect(rule.getData(element)).toEqual('Hello 123')
    })
  })

  describe('when there is a regex', () => {
    it('extracts text content from a dom node', () => {
      const rule = new TextRule({ id: 'id', selector: 'p > span', regex: /\d\d\d/ })
      expect(rule.getData(element)).toEqual('123')
    })
  })

  describe('when there is no matching element', () => {
    it('returns the default value', () => {
      const rule = new TextRule({ id: 'id', selector: 'p > div', defaultValue: 'empty' })
      expect(rule.getData(element)).toEqual('empty')
    })
  })
})

describe('AttributeRule', () => {
  const element = new Parser('<span data-id="foo-123">Hello 123</span>').window.document

  describe('when there is no regex', () => {
    it('extracts text content from a dom node', () => {
      const rule = new AttributeRule({ id: 'id', selector: 'span', attributeName: 'data-id' })
      expect(rule.getData(element)).toEqual('foo-123')
    })
  })

  describe('when there is a regex', () => {
    it('extracts text content from a dom node', () => {
      const rule = new AttributeRule({ id: 'id', selector: 'span', regex: /\d\d\d/, attributeName: 'data-id' })
      expect(rule.getData(element)).toEqual('123')
    })
  })

  describe('when there is no matching element', () => {
    it('returns the default value', () => {
      const rule = new AttributeRule({
        id: 'id',
        selector: 'div',
        regex: /\d\d\d/,
        attributeName: 'data-id',
        defaultValue: 'foo'
      })
      expect(rule.getData(element)).toEqual('foo')
    })
  })
})

describe('ElementRule', () => {
  const element = new Parser(`
    <ul>
      <li class="item">Item 1<span class="price">100</span></li>
      <li class="item">Item 2</li>
    </ul>
  `).window.document

  it('extracts the dom element with a selector', () => {
    const rule = new ElementRule({
      id: 'element',
      selector: '.item',
      children: [
        new TextRule({ id: 'name', selector: '__self', type: 'text', regex: /Item \d/ }),
        new TextRule({ id: 'price', selector: '.price', type: 'text' })
      ]
    })
    expect(rule.getData(element)).toEqual({
      name: 'Item 1',
      price: '100'
    })
  })

  describe('when there is no matching element', () => {
    it('returns the default value', () => {
      const rule = new ElementRule({
        id: 'element',
        selector: '.foo',
        defaultValue: { foo: 'foo' }
      })
      expect(rule.getData(element)).toEqual({ foo: 'foo' })
    })
  })
})

describe('ElementsRule', () => {
  const element = new Parser(`
    <ul>
      <li class="item">Item 1<span class="price">100</span></li>
      <li class="item">Item 2</li>
    </ul>
  `).window.document

  it('extracts multiple dom elements with a selector', () => {
    const rule = new ElementsRule({
      id: 'elements',
      selector: '.item',
      children: [
        new TextRule({ id: 'name', selector: '__self', type: 'text', regex: /Item \d/ }),
        new TextRule({ id: 'price', selector: '.price', type: 'text' })
      ]
    })
    expect(rule.getData(element)).toEqual([
      { name: 'Item 1', price: '100' },
      { name: 'Item 2', price: '' }
    ])
  })

  describe('when there is no matching element', () => {
    it('returns the default value', () => {
      const rule = new ElementsRule({
        id: 'elements',
        selector: '.foo',
        defaultValue: ['foo']
      })
      expect(rule.getData(element)).toEqual(['foo'])
    })
  })
})
