import { useMemo, useState } from 'react'
import { MAX_RATING, getStats, toAsciiTree, toPlantUml, toTree } from '../lib/skillMap'
import { plantUmlUrls } from '../lib/plantuml'
import { CopyButton } from './CopyButton'
import { Diagram } from './Diagram'

const TABS = [
  { id: 'map', label: 'Mind map' },
  { id: 'tree', label: 'Tree' },
  { id: 'plantuml', label: 'PlantUML' },
  { id: 'json', label: 'JSON' },
]

export const MindMapCard = ({ data, balanced }) => {
  const [tab, setTab] = useState('map')

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

  const text = { tree, plantuml: uml, json }[tab]

  return (
    <article className="card">
      <header className="card-head">
        <div>
          <h3 className="card-title">{title}</h3>
          {stats.skills > 0 && (
            <p className="card-meta">
              {stats.skills} rated {stats.skills === 1 ? 'skill' : 'skills'} · average{' '}
              <span className="star">★</span> {stats.average.toFixed(1)} / {MAX_RATING}
            </p>
          )}
        </div>
        <div className="segmented" role="group" aria-label="View">
          {TABS.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
      </header>

      {tab === 'map' ? (
        <>
          <Diagram key={urls.svg} src={urls.svg} alt={`Mind map: ${title}`} />
          <div className="card-actions">
            <a className="button button-small" href={urls.svg} target="_blank" rel="noreferrer">
              Open SVG ↗
            </a>
            <a className="button button-small" href={urls.png} target="_blank" rel="noreferrer">
              Open PNG ↗
            </a>
            <a className="button button-small" href={urls.editor} target="_blank" rel="noreferrer">
              Edit on plantuml.com ↗
            </a>
          </div>
        </>
      ) : (
        <>
          <pre className="code" tabIndex={0}>
            {text}
          </pre>
          <div className="card-actions">
            <CopyButton text={text} />
          </div>
        </>
      )}
    </article>
  )
}
