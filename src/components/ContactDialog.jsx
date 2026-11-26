import { forwardRef, useState } from 'react'

const CONTACT_FORM_KEY = '8674bf2a-c248-426a-aed4-379fa983cb34'

/** The Contact me window: the message reaches my inbox through Web3Forms. */
export const ContactDialog = forwardRef((_props, ref) => {
  const [state, setState] = useState('idle')

  const close = () => ref.current?.close()

  const send = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const message = Object.fromEntries(new FormData(form))
    message.access_key = CONTACT_FORM_KEY
    message.subject = `skill-visualizer: a message from ${message.name}`
    message.from_name = 'skill-visualizer contact form'

    setState('sending')
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(message),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.message)
      form.reset()
      setState('sent')
    } catch {
      setState('failed')
    }
  }

  return (
    // A click on the dark area around the window closes it too.
    <dialog ref={ref} className="contact" onClick={(event) => event.target === event.currentTarget && close()}>
      <div className="contact-window">
        <button type="button" className="contact-close" onClick={close} aria-label="Close">
          ×
        </button>
        <h2>Get in touch</h2>
        <p className="muted">Write me a message and I'll write back.</p>

        <form className="contact-form" onSubmit={send}>
          <label>
            Name
            <input name="name" required maxLength={100} autoComplete="name" />
          </label>
          <label>
            E-mail
            <input name="email" type="email" required maxLength={200} autoComplete="email" />
          </label>
          <label>
            Message
            <textarea name="message" required maxLength={5000} rows={5} />
          </label>
          {/* People never see this box, spam bots tick it. */}
          <input className="botcheck" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />

          <button type="submit" className="button button-primary" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p className="contact-status" aria-live="polite">
            {state === 'sent' && "Thank you! Your message is on its way, I'll write back soon."}
            {state === 'failed' && "Sorry, the message couldn't be sent. Please try again a bit later."}
          </p>
          <p className="contact-small muted">
            Your message reaches my inbox through Web3Forms. I only use your name and e-mail address to write back to
            you.
          </p>
        </form>
      </div>
    </dialog>
  )
})

ContactDialog.displayName = 'ContactDialog'
