import escapeString from './escape-string'
import childElements from './child-elements'
import stringifyAttributes from './stringify-attributes'

// https://www.w3.org/TR/html/syntax.html#void-elements
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
])

const INNER_HTML = 'dangerouslySetInnerHTML'

// best guess if a child element was rendered by this module
function fragment(node) {
  return /^</.test(node) && />$/.test(node)
}

/**
 * Hyperons
 * @param {String|Function} element
 * @param {Object|null} props
 * @param {...String|String[]} children
 */
function hyperons(element, props, ...children) {
  if (element == null) {
    return ''
  }

  // support for higher-order components
  if (typeof element === 'function') {
    return element({ ...props, children })
  }

  let out = `<${element}`

  if (props) {
    out += stringifyAttributes(props)
  }

  // if a self-closing void element has children then
  if (VOID_ELEMENTS.has(element)) {
    out += '/>'
  } else {
    out += '>'

    if (props && props[INNER_HTML] && props[INNER_HTML].__html) {
      out += props[INNER_HTML].__html
    } else {
      out += childElements(children)
    }

    out += `</${element}>`
  }

  return out
}

export default hyperons
