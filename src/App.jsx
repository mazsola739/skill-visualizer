import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ContactDialog } from './components/ContactDialog'
import { JsonEditor } from './components/JsonEditor'
import { MindMapCard } from './components/MindMapCard'
import { examples, rikaMaps, rikaMaps2026, starterExample } from './data/presets'
import { parseSkillJson } from './lib/parseInput'
import { getStats } from './lib/skillMap'

const DRAFT_KEY = 'skill-visualizer:draft'
const REPO_URL = 'https://github.com/mazsola739/skill-visualizer'
const ORIGINAL_URL = 'https://github.com/mazsola739/skill-visualizer/tree/35ba4b7'
const PORTFOLIO_URL = 'https://mazsola739.github.io/mazsola739/'

const TABS = [
  { id: 'about', label: 'About' },
  ...rikaMaps2026.map(({ id, label }, index) => ({ id, label, group: index === 0 && '2026' })),
  ...rikaMaps.map(({ id, label }, index) => ({ id, label, group: index === 0 && '2021' })),
  { id: 'yours', label: 'Draw yours' },
]

// localStorage can be unavailable (private mode, blocked storage) – the app works without it.
const loadDraft = () => {
  try {
    return localStorage.getItem(DRAFT_KEY)
  } catch {
    return null
  }
}
const saveDraft = (text) => {
  try {
    localStorage.setItem(DRAFT_KEY, text)
  } catch {
    /* ignore */
  }
}

const pretty = (value) => JSON.stringify(value, null, 2)

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

const summarize = (maps) => {
  const skills = maps.reduce((sum, map) => sum + getStats(map).skills, 0)
  return `Looks good – ${plural(maps.length, 'map')}, ${plural(skills, 'rated skill')}.`
}

const About = ({ onOpen }) => (
  <section className="panel about">
    <h2>Rika's skills in 2021</h2>
    <p>
      I've always liked visual overviews – they make things much easier to take in. So I wondered: what if my knowledge
      could be seen too, like a tree and its branches? Before a job interview I was asked to put together a small hobby
      project of my own, and this is what came of it :)
    </p>
    <p>
      The HTML, CSS, JavaScript and Other skills tabs show my skills in June 2021, when I built this app as my first
      React project – every skill rated from 0 to 8 stars. The 2026 tabs show what I know five years later: front end first, then back end and other skills.
    </p>
    <div className="about-actions">
      <button type="button" className="button button-primary" onClick={() => onOpen(rikaMaps2026[0].id)}>
        See my 2026 maps
      </button>
      <button type="button" className="button" onClick={() => onOpen(rikaMaps[0].id)}>
        See my 2021 maps
      </button>
      <button type="button" className="button" onClick={() => onOpen('yours')}>
        Draw your own
      </button>
    </div>
  </section>
)

const App = () => {
  const [tab, setTab] = useState(rikaMaps2026[0].id)
  const [text, setText] = useState(() => loadDraft() ?? pretty(starterExample))
  const [yourMaps, setYourMaps] = useState(null)
  const [yourIndex, setYourIndex] = useState(0)
  // On phones the "Draw yours" tab shows either the editor or the map.
  const [yourPane, setYourPane] = useState('editor')
  // Narrow screens read a one-sided map better, so "Branches on both sides" starts off there.
  const [balanced, setBalanced] = useState(() => !window.matchMedia?.('(max-width: 759px)').matches)
  const contactRef = useRef(null)

  const parsed = useMemo(() => parseSkillJson(text), [text])
  const status = parsed.error ? { error: parsed.error } : { summary: summarize(parsed.maps) }

  useEffect(() => saveDraft(text), [text])

  // On phones the tab bar scrolls sideways – keep the chosen tab in sight.
  useEffect(() => {
    document.querySelector('.tabs [aria-pressed="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [tab])

  const visualize = () => {
    if (parsed.error) return
    setYourMaps(parsed.maps)
    setYourIndex(0)
    setYourPane('map')
  }

  const format = () => {
    if (!parsed.error) setText(pretty(JSON.parse(text)))
  }

  const rikaMap = [...rikaMaps2026, ...rikaMaps].find((map) => map.id === tab)

  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">
          <img src="./favicon.svg" alt="" width="36" height="36" />
          <div>
            <h1>Rika's skill-visualizer</h1>
            <p>JSON in, mind map out – every skill rated from 0 to 8 stars.</p>
          </div>
        </div>
        <nav className="tabs" aria-label="Sections">
          {TABS.map(({ id, label, group }) => (
            <Fragment key={id}>
              {group && (
                <span className="tabs-group" aria-hidden="true">
                  {group}
                </span>
              )}
              <button type="button" aria-pressed={tab === id} onClick={() => setTab(id)} aria-label={group ? `${label} ${group}` : undefined}>
                {label}
              </button>
            </Fragment>
          ))}
        </nav>
      </header>

      <main className="stage">
        {tab === 'about' && <About onOpen={setTab} />}

        {rikaMap && <MindMapCard key={rikaMap.id} data={rikaMap.data} balanced={balanced} onBalancedChange={setBalanced} />}

        {tab === 'yours' && (
          <div className="yours" data-pane={yourPane}>
            <div className="segmented yours-switch" role="group" aria-label="Show">
              <button type="button" aria-pressed={yourPane === 'editor'} onClick={() => setYourPane('editor')}>
                JSON
              </button>
              <button type="button" aria-pressed={yourPane === 'map'} onClick={() => setYourPane('map')}>
                Mind map
              </button>
            </div>

            <JsonEditor
              value={text}
              onChange={setText}
              status={status}
              onSubmit={visualize}
              onFormat={format}
              examples={examples}
            />

            {yourMaps ? (
              <MindMapCard
                key={`${yourIndex}-${yourMaps.length}`}
                data={yourMaps[yourIndex]}
                balanced={balanced}
                onBalancedChange={setBalanced}
              >
                {yourMaps.length > 1 && (
                  <select
                    className="button button-small map-picker"
                    value={yourIndex}
                    onChange={(event) => setYourIndex(Number(event.target.value))}
                    aria-label="Choose a map"
                  >
                    {yourMaps.map((_, index) => (
                      <option key={index} value={index}>
                        Map {index + 1} of {yourMaps.length}
                      </option>
                    ))}
                  </select>
                )}
              </MindMapCard>
            ) : (
              <div className="panel placeholder">
                <p>
                  Paste your skills as JSON and press <strong>Visualize</strong> – your mind map appears here.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="site-footer">
        <p>2021–2026 · React, JavaScript, CSS, PlantUML</p>
        <p className="joke">My first React app: I had no idea what I was doing, but it worked :)</p>
        <p>
          <a href={ORIGINAL_URL} target="_blank" rel="noreferrer">
            original version (2021)
          </a>{' '}
          ·{' '}
          <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer">
            Portfolio
          </a>{' '}
          ·{' '}
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>{' '}
          ·{' '}
          <button type="button" className="link" onClick={() => contactRef.current?.showModal()}>
            Contact me
          </button>
        </p>
      </footer>

      <ContactDialog ref={contactRef} />
    </div>
  )
}

export default App
