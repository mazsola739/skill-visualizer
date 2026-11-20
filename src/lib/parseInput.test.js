import { describe, expect, it } from 'vitest'
import { parseSkillJson } from './parseInput'

describe('parseSkillJson', () => {
  it('wraps a single object in a list', () => {
    expect(parseSkillJson('{"Skills": {"React": 5}}')).toEqual({ maps: [{ Skills: { React: 5 } }] })
  })

  it('turns an array into several maps', () => {
    expect(parseSkillJson('[{"A": 1}, {"B": 2}]').maps).toHaveLength(2)
  })

  it('reports invalid JSON instead of throwing', () => {
    expect(parseSkillJson('{"A": ').error).toMatch(/not valid JSON/)
  })

  it('rejects empty input and wrong shapes', () => {
    expect(parseSkillJson('   ').error).toMatch(/empty/)
    expect(parseSkillJson('42').error).toMatch(/Expected an object/)
    expect(parseSkillJson('[]').error).toMatch(/array is empty/)
    expect(parseSkillJson('{}').error).toMatch(/nothing to draw/)
  })
})
