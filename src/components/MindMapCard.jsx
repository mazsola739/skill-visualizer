import { useMemo, useState } from 'react'
import { MAX_RATING, getStats, toAsciiTree, toPlantUml, toTree } from '../lib/skillMap'
import { plantUmlUrls } from '../lib/plantuml'
import { CopyButton } from './CopyButton'
import { Diagram } from './Diagram'

const VIEWS = [
  { id: 'map', label: 'Mind map' },
  { id: 'tree', label: 'Tree' },
  { id: 'plantuml', label: 'PlantUML' },
  { id: 'json', label: 'JSON' },
]

/** One mind map that fills the space it gets: a toolbar on top, the map (or its text) under it. */
export const MindMapCard = ({ data, balanced, onBalancedChange, children }) => {
  const [view, setView] = useState('map')

  const { title, stats, uml, urls, tree, json } = useMemo(() => {
    const uml = toPlantUml(data, { balanced })
    return {
      title: toTree(data).map((node) => node.label).join(' · '),
      stats: getStats(data),
      uml,
      urls: plantUmlUrls(uml),
      tree: toAsciiTree(data),
      json: JSON.stringify(data, null, 2),
    }
  }, [data, balanced])

  const text = { tree, plantuml: uml, json }[view]

  return (
    <article className="card">
      <header className="card-head">
        <div className="card-heading">
          <h2 className="card-title">{title}</h2>
          {stats.skills > 0 && (
            <p className="card-meta">
              {stats.skills} rated {stats.skills === 1 ? 'skill' : 'skills'} · average{' '}
              <span className="star">★</span> {stats.average.toFixed(1)} / {MAX_RATING}
            </p>
          )}
        </div>
        {children}
        <div className="segmented" role="group" aria-label="View">
          {VIEWS.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>
              {label}
            </button>
          ))}
        </div>
      </header>

      {view === 'map' ? (
        <Diagram key={urls.svg} src={urls.svg} alt={`Mind map: ${title}`} />
      ) : (
        <pre className="code card-code" tabIndex={0}>
          {text}
        </pre>
      )}

      <footer className="card-actions">
        {view === 'map' ? (
          <>
            <label className="toggle">
              <input type="checkbox" checked={balanced} onChange={(event) => onBalancedChange(event.target.checked)} />
              Branches on both sides
            </label>
            <span className="card-links">
              <a className="button button-small" href={urls.svg} target="_blank" rel="noreferrer">
                Open SVG
              </a>
              <a className="button button-small" href={urls.png} target="_blank" rel="noreferrer">
                Open PNG
              </a>
            </span>
          </>
        ) : (
          <CopyButton text={text} />
        )}
      </footer>
    </article>
  )
}
