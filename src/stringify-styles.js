const UPPERCASE = /([A-Z])/g

const MS = /^ms-/

const UNITLESS = new Set([
  'animationIterationCount',
  'columns',
  'columnCount',
  'flex',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnStart',
  'gridRow',
  'gridRowEnd',
  'gridRowStart',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom'
])

function hyphenate(property) {
  return property
    .replace(UPPERCASE, '-$1')
    .replace(MS, '-ms-')
    .toLowerCase()
}

function stringifyStyles(styles) {
  let out = ''

  for (const prop in styles) {
    const value = styles[prop]

    if (value == null) {
      continue
    }

    out += `${hyphenate(prop)}:${value}`

    if (typeof value === 'number' && value !== 0 && !UNITLESS.has(prop)) {
      out += 'px'
    }

    out += ';'
  }

  return out
}

export default stringifyStyles
