const { TextRule, AttributeRule, ElementsRule, ElementRule } = require('./rule')

const RuleFactory = ({ id, type, selector, ...rest }) => {
  switch (type) {
    case 'text':
      return new TextRule({ id, type, selector, regex: rest.regex })
    case 'attribute':
      return new AttributeRule({
        id,
        type,
        selector,
        regex: rest.regex,
        attributeName: rest.attribute
      })
    case 'element':
      return new ElementRule({
        id,
        type,
        selector,
        children: rest.children.map(RuleFactory)
      })
    case 'elements':
      return new ElementsRule({
        id,
        type,
        selector,
        children: rest.children.map(RuleFactory)
      })
    default:
      throw Error('UNKNOWN SELECTOR TYPE: ' + type)
  }
}

module.exports = document => recipe => recipe.rules
  .map(RuleFactory)
  .reduce((acc, current) => ({
    ...acc,
    [current.id]: current.getData(document)
  }), {})
