import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeEach(() => localStorage.clear())

  it("shows Rika's skill maps on load", () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: "Rika's skills" })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(4)
    expect(screen.getByText(/Looks good/)).toBeInTheDocument()
  })

  it('reports invalid JSON instead of crashing', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Your skills as JSON'), { target: { value: '{"Me": ' } })
    expect(screen.getByText(/not valid JSON/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Visualize' })).toBeDisabled()
  })

  it('draws the JSON from the editor', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Your skills as JSON'), { target: { value: '{"Me": {"React": 5}}' } })
    fireEvent.click(screen.getByRole('button', { name: 'Visualize' }))

    expect(screen.getByRole('heading', { name: 'Your mind map' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(1)
    // The image stays hidden until the PlantUML server answers, so query by alt text.
    expect(screen.getByAltText('Mind map: Me')).toHaveAttribute(
      'src',
      expect.stringMatching(/^https:\/\/www\.plantuml\.com\/plantuml\/svg\//),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Tree' }))
    expect(screen.getByText(/React ★★★★★☆☆☆ 5\/8/)).toBeInTheDocument()
  })
})
