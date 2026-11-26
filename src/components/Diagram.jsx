import { useRef, useState } from 'react'

const STEP = 1.25
const MIN_SCALE = 0.1
const MAX_SCALE = 4

/**
 * The mind map image from the PlantUML server, with loading and error states.
 * It starts fitted to the space it gets; − / + zoom out and in, and a zoomed map can be dragged around.
 * Re-mount it (key) when the URL changes.
 */
export const Diagram = ({ src, alt }) => {
  const [status, setStatus] = useState('loading')
  // null = fit to the box, a number = that many times the natural size.
  const [scale, setScale] = useState(null)
  const boxRef = useRef(null)
  const imgRef = useRef(null)
  const drag = useRef(null)

  const fitScale = () => {
    const box = boxRef.current
    const img = imgRef.current
    if (!box || !img?.naturalWidth) return 1
    return Math.min(box.clientWidth / img.naturalWidth, box.clientHeight / img.naturalHeight)
  }

  const zoom = (factor) => {
    const box = boxRef.current
    const current = scale ?? fitScale()
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current * factor))
    // Keep the middle of the view in the middle while zooming.
    const centerX = (box.scrollLeft + box.clientWidth / 2) / current
    const centerY = (box.scrollTop + box.clientHeight / 2) / current
    setScale(next)
    requestAnimationFrame(() => {
      box.scrollLeft = centerX * next - box.clientWidth / 2
      box.scrollTop = centerY * next - box.clientHeight / 2
    })
  }

  const onPointerDown = (event) => {
    if (scale === null) return
    const box = boxRef.current
    drag.current = { x: event.clientX, y: event.clientY, left: box.scrollLeft, top: box.scrollTop }
    box.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!drag.current) return
    const box = boxRef.current
    box.scrollLeft = drag.current.left - (event.clientX - drag.current.x)
    box.scrollTop = drag.current.top - (event.clientY - drag.current.y)
  }

  const endDrag = () => {
    drag.current = null
  }

  const zoomed = scale !== null
  const width = zoomed && imgRef.current ? imgRef.current.naturalWidth * scale : undefined

  return (
    <figure className="diagram" data-zoomed={zoomed}>
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
      <div
        ref={boxRef}
        className="diagram-box"
        hidden={status !== 'ready'}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          style={zoomed ? { width, height: 'auto' } : undefined}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
        />
      </div>
      {status === 'ready' && (
        <div className="zoom" role="group" aria-label="Zoom">
          <button type="button" onClick={() => zoom(1 / STEP)} aria-label="Zoom out" title="Zoom out">
            −
          </button>
          <button type="button" onClick={() => setScale(null)} aria-pressed={!zoomed} title="Fit to the box">
            Fit
          </button>
          <button type="button" onClick={() => zoom(STEP)} aria-label="Zoom in" title="Zoom in">
            +
          </button>
        </div>
      )}
    </figure>
  )
}
