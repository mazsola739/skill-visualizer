import { useState } from 'react'

/** The mind map image from the PlantUML server, with loading and error states. Re-mount it (key) when the URL changes. */
export const Diagram = ({ src, alt }) => {
  const [status, setStatus] = useState('loading')

  return (
    <figure className="diagram" data-status={status}>
      {status === 'loading' && (
        <div className="diagram-message">
          <span className="spinner" aria-hidden="true" /> Drawing the mind map…
        </div>
      )}
      {status === 'error' && (
        <div className="diagram-message diagram-error" role="alert">
          The PlantUML server could not draw this map. Check your internet connection, or try a smaller JSON.
        </div>
      )}
      <a href={src} target="_blank" rel="noreferrer" hidden={status !== 'ready'} title="Open full size in a new tab">
        <img src={src} alt={alt} onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />
      </a>
    </figure>
  )
}
