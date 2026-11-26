// Turns a skill JSON into a normalised tree, an ASCII tree and a PlantUML mind map.
//
// Input shape: nested objects. A number (0–8) is a rating, an object is a group.
//   { "Frontend": { "React": 6, "CSS": { "Flexbox": 7 } } }

export const MAX_RATING = 8

const BASE_COLOR = '#00abf5'
const TEXT_COLOR = '#464547'
const STAR_COLOR = '#b22746'

const isGroup = (value) => value !== null && typeof value === 'object'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/** Numbers and numeric strings become a 0–MAX_RATING integer, anything else is null. */
const toRating = (value) => {
  if (typeof value === 'string' && value.trim() === '') return null
  if (typeof value !== 'number' && typeof value !== 'string') return null
  const number = Number(value)
  return Number.isFinite(number) ? clamp(Math.round(number), 0, MAX_RATING) : null
}

const stars = (rating) => '★'.repeat(rating) + '☆'.repeat(MAX_RATING - rating)

const cleanLabel = (key) => String(key).replace(/\s+/g, ' ').trim() || '(unnamed)'

// Arrays are accepted too: ["React", "Vue"] or [{ "React": 5 }, { "Vue": 2 }].
const entriesOf = (value) =>
  Array.isArray(value)
    ? value.flatMap((item) => (isGroup(item) ? entriesOf(item) : [[item, null]]))
    : Object.entries(value)

const toNode = (key, value) => {
  const label = cleanLabel(key)
  if (isGroup(value)) {
    return { label, children: entriesOf(value).map(([k, v]) => toNode(k, v)) }
  }
  const rating = toRating(value)
  if (rating !== null) return { label, rating, children: [] }
  const note = value === null || value === undefined || value === '' ? null : cleanLabel(value)
  return note ? { label, note, children: [] } : { label, children: [] }
}

/** Normalised tree: [{ label, rating?, note?, children: [...] }] */
export const toTree = (data) => (isGroup(data) ? entriesOf(data).map(([k, v]) => toNode(k, v)) : [])

const walk = (nodes, visit) =>
  nodes.forEach((node) => {
    visit(node)
    walk(node.children, visit)
  })

export const getStats = (data) => {
  const ratings = []
  walk(toTree(data), (node) => node.rating !== undefined && ratings.push(node.rating))
  const total = ratings.reduce((sum, rating) => sum + rating, 0)
  return {
    skills: ratings.length,
    average: ratings.length ? total / ratings.length : 0,
  }
}

const depthOf = (nodes) => (nodes.length ? 1 + Math.max(...nodes.map((n) => depthOf(n.children))) : 0)

const leafCount = (node) =>
  node.children.length ? node.children.reduce((sum, child) => sum + leafCount(child), 0) : 1

// ---------------------------------------------------------------------------
// ASCII tree
// ---------------------------------------------------------------------------

const describeLeaf = (node) => {
  if (node.rating !== undefined) return `  ${stars(node.rating)} ${node.rating}/${MAX_RATING}`
  if (node.note) return ` ─ ${node.note}`
  return ''
}

const asciiLines = (nodes, prefix) =>
  nodes.flatMap((node, index) => {
    const last = index === nodes.length - 1
    return [
      `${prefix}${last ? '└─ ' : '├─ '}${node.label}${describeLeaf(node)}`,
      ...asciiLines(node.children, prefix + (last ? '   ' : '│  ')),
    ]
  })

export const toAsciiTree = (data) => asciiLines(toTree(data), '').join('\n')

// ---------------------------------------------------------------------------
// PlantUML mind map
// ---------------------------------------------------------------------------

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

const rgbToHex = (rgb) =>
  '#' + rgb.map((c) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0')).join('')

/** Mixes `hex` with white. amount 0 = original colour, 1 = white. */
const lighten = (hex, amount) => rgbToHex(hexToRgb(hex).map((c) => c + (255 - c) * amount))

// Root stays close to the base colour, the deepest level ends up very light.
const colorForDepth = (depth, maxDepth) => {
  const progress = maxDepth > 1 ? (depth - 1) / (maxDepth - 1) : 0
  return lighten(BASE_COLOR, 0.15 + progress * 0.7)
}

// PlantUML uses Creole markup (**bold**, //italic//, <tags>, [[links]] ...).
// "~" is its escape character, so we neutralise anything that could be read as markup.
const escapeCreole = (text) => text.replace(/([*/"\-_^=])\1/g, '~$1$1').replace(/([<[])/g, '~$1')

const umlLines = (node, depth, maxDepth) => {
  const stem = '*'.repeat(depth)
  const lines = [`${stem}[${colorForDepth(depth, maxDepth)}] <color:${TEXT_COLOR}>${escapeCreole(node.label)}`]
  if (node.rating !== undefined) {
    lines.push(`${stem}*_ <color:${STAR_COLOR}>${stars(node.rating)}`)
  } else if (node.note) {
    lines.push(`${stem}*_ <color:${TEXT_COLOR}>//${escapeCreole(node.note)}//`)
  }
  node.children.forEach((child) => lines.push(...umlLines(child, depth + 1, maxDepth)))
  return lines
}

/** Index where the root's children are split so both sides hold roughly the same number of leaves. */
const balancedSplit = (children) => {
  const total = children.reduce((sum, child) => sum + leafCount(child), 0)
  let running = 0
  for (let i = 0; i < children.length; i++) {
    running += leafCount(children[i])
    if (running >= total / 2) return i + 1
  }
  return children.length
}

/**
 * @param {object} data skill JSON
 * @param {{ title?: string, footer?: string, balanced?: boolean, theme?: string }} options
 */
export const toPlantUml = (data, { title = "Rika's skill-visualizer", footer = 'Rika©', balanced = true, theme = 'spacelab' } = {}) => {
  const roots = toTree(data)
  // +1 because ratings/notes are drawn one level below their skill.
  const maxDepth = depthOf(roots) + 1
  const lines = ['@startmindmap']
  if (theme) lines.push(`!theme ${theme}`)
  if (title) lines.push(`title ${escapeCreole(title)}`)
  lines.push('')

  roots.forEach((root) => {
    const children = root.children
    const split = balanced && roots.length === 1 && children.length > 1 ? balancedSplit(children) : children.length
    // Root box (plus its own rating, if it has one) first, then the two sides.
    lines.push(...umlLines({ ...root, children: [] }, 1, maxDepth))
    children.slice(0, split).forEach((child) => lines.push(...umlLines(child, 2, maxDepth)))
    if (split < children.length) {
      lines.push('left side')
      children.slice(split).forEach((child) => lines.push(...umlLines(child, 2, maxDepth)))
    }
  })

  if (footer) lines.push('', 'legend right', `  ${escapeCreole(footer)}`, 'endlegend')
  lines.push('@endmindmap')
  return lines.join('\n')
}
