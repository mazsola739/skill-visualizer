import { useEffect, useMemo, useRef, useState } from 'react'
import { JsonEditor } from './components/JsonEditor'
import { MindMapCard } from './components/MindMapCard'
import { examples, rikaSkills, starterExample } from './data/presets'
import { parseSkillJson } from './lib/parseInput'
import { getStats } from './lib/skillMap'

const DRAFT_KEY = 'skill-visualizer:draft'
const REPO_URL = 'https://github.com/mazsola739/skill-visualizer'
const PORTFOLIO_URL = 'https://mazsola739.github.io/mazsola739/'

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

const App = () => {
  const [text, setText] = useState(() => loadDraft() ?? pretty(starterExample))
  const [view, setView] = useState({ owner: 'rika', maps: rikaSkills })
  const [balanced, setBalanced] = useState(true)
  const resultsRef = useRef(null)

  const parsed = useMemo(() => parseSkillJson(text), [text])
  const status = parsed.error ? { error: parsed.error } : { summary: summarize(parsed.maps) }

  useEffect(() => saveDraft(text), [text])

  const visualize = () => {
    if (parsed.error) return
    setView({ owner: 'user', maps: parsed.maps })
    // On narrow screens the results are above the editor – bring them into view.
    if (window.matchMedia?.('(max-width: 1099px)').matches) {
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  const format = () => {
    if (!parsed.error) setText(pretty(JSON.parse(text)))
  }

  const isRika = view.owner === 'rika'

  return (
    <div className="page">
      <header className="site-header">
        <div className="brand">
          <img src="./favicon.svg" alt="" width="40" height="40" />
          <div>
            <h1>Rika's skill-visualizer</h1>
            <p>Turn a JSON list of skills into a mind map – every skill rated from 0 to 8 stars.</p>
          </div>
        </div>
        <a className="button button-small" href={REPO_URL} target="_blank" rel="noreferrer">
          Source on GitHub ↗
        </a>
      </header>

      <main className="layout">
        <JsonEditor
          value={text}
          onChange={setText}
          status={status}
          onSubmit={visualize}
          onFormat={format}
          examples={examples}
        />

        <section className="results" ref={resultsRef} aria-labelledby="results-title">
          <div className="results-head">
            <div>
              <h2 id="results-title">
                {isRika ? "Rika's skills in 2021" : `Your ${view.maps.length > 1 ? 'mind maps' : 'mind map'}`}
              </h2>
              {isRika ? (
                <>
                  <p className="muted story">
                    I've always liked visual overviews – they make things much easier to take in. So I wondered: what
                    if my knowledge could be seen too, like a tree and its branches? Before a job interview I was asked
                    to put together a small hobby project of my own, and this is what came of it :)
                  </p>
                  <p className="muted">
                    These maps show my skills in June 2021, when I built this app as my first React project. Paste your
                    JSON into the editor to draw yours.
                  </p>
                </>
              ) : (
                <p className="muted">Edit the JSON and press Visualize again to update.</p>
              )}
            </div>
            <div className="results-tools">
              <label className="toggle">
                <input type="checkbox" checked={balanced} onChange={(event) => setBalanced(event.target.checked)} />
                Branches on both sides
              </label>
              {!isRika && (
                <button type="button" className="button button-small" onClick={() => setView({ owner: 'rika', maps: rikaSkills })}>
                  Show Rika's 2021 skills
                </button>
              )}
            </div>
          </div>

          {view.maps.map((map, index) => (
            <MindMapCard key={`${view.owner}-${index}`} data={map} balanced={balanced} />
          ))}
        </section>
      </main>

      <footer className="site-footer">
        My very first React project, made in 2021 · refreshed in 2026 · Diagrams by{' '}
        <a href="https://plantuml.com" target="_blank" rel="noreferrer">
          PlantUML
        </a>{' '}
        ·{' '}
        <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer">
          mazsola739 portfolio
        </a>
      </footer>
    </div>
  )
}

export default App
