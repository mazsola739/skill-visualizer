import { useId } from 'react'
import { MAX_RATING } from '../lib/skillMap'

export const JsonEditor = ({ value, onChange, status, onSubmit, onFormat, examples }) => {
  const id = useId()

  const loadExample = (event) => {
    const example = examples.find((item) => item.id === event.target.value)
    if (example) onChange(JSON.stringify(example.data, null, 2))
    event.target.value = ''
  }

  const openFile = async (event) => {
    const file = event.target.files?.[0]
    if (file) onChange(await file.text())
    event.target.value = ''
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <form
      className="panel editor"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="editor-head">
        <label className="panel-title" htmlFor={`${id}-json`}>
          Your skills as JSON
        </label>
        <div className="editor-tools">
          <select className="button button-small" defaultValue="" onChange={loadExample} aria-label="Load an example">
            <option value="" disabled>
              Load example…
            </option>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>
                {example.label}
              </option>
            ))}
          </select>
          <label className="button button-small file-button">
            Open file
            <input type="file" accept=".json,application/json" onChange={openFile} />
          </label>
          <button type="button" className="button button-small" onClick={onFormat} disabled={Boolean(status.error)}>
            Format
          </button>
        </div>
      </div>

      <textarea
        id={`${id}-json`}
        className="code editor-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        aria-invalid={Boolean(status.error)}
        aria-describedby={`${id}-status`}
      />

      <p id={`${id}-status`} className={`editor-status ${status.error ? 'is-error' : 'is-ok'}`}>
        {status.error ?? status.summary}
      </p>

      <div className="editor-actions">
        <button type="submit" className="button button-primary" disabled={Boolean(status.error)}>
          Visualize
        </button>
        <kbd className="hint">Ctrl + Enter</kbd>
      </div>

      <details className="help">
        <summary>How should the JSON look?</summary>
        <ul>
          <li>
            Objects are groups, numbers are ratings from <strong>0</strong> to <strong>{MAX_RATING}</strong> stars:{' '}
            <code>{'{ "Frontend": { "React": 6 } }'}</code>
          </li>
          <li>
            Text values are shown as a note (<code>{'"Level": "junior"'}</code>), lists become plain items (
            <code>{'"Tools": ["Git", "npm"]'}</code>).
          </li>
          <li>Wrap several objects in an array <code>[ … ]</code> to draw several maps at once.</li>
          <li>The diagram is drawn by the public PlantUML server, so your JSON is sent to plantuml.com.</li>
        </ul>
      </details>
    </form>
  )
}
