import example from './example.json'
import html from './html.json'
import css from './css.json'
import javascript from './javascript.json'
import otherSkills from './otherskills.json'
import coreConcepts from './skills.json'

/** The maps shown when the page opens. */
export const rikaSkills = [html, css, javascript, otherSkills]

export const starterExample = example

/** Entries of the "Load example" menu. */
export const examples = [
  { id: 'starter', label: 'Small example', data: example },
  { id: 'html', label: "Rika's HTML skills", data: html },
  { id: 'css', label: "Rika's CSS skills", data: css },
  { id: 'javascript', label: "Rika's JavaScript skills", data: javascript },
  { id: 'other', label: "Rika's other skills", data: otherSkills },
  { id: 'core', label: 'Core concepts (big)', data: coreConcepts },
  { id: 'all', label: "All of Rika's maps (array)", data: rikaSkills },
]
