import example from './example.json'
import html from './html.json'
import css from './css.json'
import javascript from './javascript.json'
import otherSkills from './otherskills.json'
import coreConcepts from './skills.json'
import backend2026 from './backend2026.json'
import frontend2026 from './frontend2026.json'
import other2026 from './other2026.json'

/** My skills in June 2021, when I built this app – one tab each. */
export const rikaMaps = [
  { id: 'html', label: 'HTML', data: html },
  { id: 'css', label: 'CSS', data: css },
  { id: 'javascript', label: 'JavaScript', data: javascript },
  { id: 'other', label: 'Other skills', data: otherSkills },
]

const rikaSkills = rikaMaps.map((map) => map.data)

/** What I know in 2026, five years after the first maps – the front end comes first. */
export const rikaMaps2026 = [
  { id: 'frontend-2026', label: 'Front end', data: frontend2026 },
  { id: 'backend-2026', label: 'Back end', data: backend2026 },
  { id: 'other-2026', label: 'Other skills', data: other2026 },
]

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
  { id: 'frontend-2026', label: "Rika's front end skills (2026)", data: frontend2026 },
  { id: 'backend-2026', label: "Rika's back end skills (2026)", data: backend2026 },
  { id: 'other-2026', label: "Rika's other skills (2026)", data: other2026 },
]
