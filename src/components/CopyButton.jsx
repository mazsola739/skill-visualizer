import { useEffect, useRef, useState } from 'react'

export const CopyButton = ({ text, label = 'Copy' }) => {
  const [state, setState] = useState('idle')
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 1600)
  }

  return (
    <button type="button" className="button button-small" onClick={copy} aria-live="polite">
      {state === 'copied' ? 'Copied ✓' : state === 'failed' ? 'Copy failed' : label}
    </button>
  )
}
