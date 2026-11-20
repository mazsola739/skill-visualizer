import example from './example.json'
import html from './html.json'
import css from './css.json'
import javascript from './javascript.json'
import otherSkills from './otherskills.json'
import coreConcepts from './skills.json'

/** The maps shown when the page opens: my skills in June 2021, when I built this app. */
export const rikaSkills = [html, css, javascript, otherSkills]

export const starterExample = example

/** Entries of the "Load example" menu. */
export const examples = [
  { id: 'starter', label: 'Small example', data: example },
  { id: 'html', label: "Rika's HTML skills (2021)", data: html },
  { id: 'css', label: "Rika's CSS skills (2021)", data: css },
  { id: 'javascript', label: "Rika's JavaScript skills (2021)", data: javascript },
  { id: 'other', label: "Rika's other skills (2021)", data: otherSkills },
  { id: 'core', label: 'Core concepts (big)', data: coreConcepts },
  { id: 'all', label: "All of Rika's 2021 maps (array)", data: rikaSkills },
]
