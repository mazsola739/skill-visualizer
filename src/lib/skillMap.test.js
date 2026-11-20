import { describe, expect, it } from 'vitest'
import { escapeCreole, getStats, lighten, stars, toAsciiTree, toPlantUml, toRating, toTree } from './skillMap'

describe('toRating', () => {
  it('accepts numbers and numeric strings', () => {
    expect(toRating(5)).toBe(5)
    expect(toRating('7')).toBe(7)
    expect(toRating(4.6)).toBe(5)
  })

  it('clamps to the 0–8 scale', () => {
    expect(toRating(9)).toBe(8)
    expect(toRating(-2)).toBe(0)
  })

  it('returns null for anything that is not a number', () => {
    expect(toRating('es6')).toBeNull()
    expect(toRating('')).toBeNull()
    expect(toRating(null)).toBeNull()
    expect(toRating(true)).toBeNull()
  })
})

describe('stars', () => {
  it('always shows 8 stars', () => {
    expect(stars(3)).toBe('★★★☆☆☆☆☆')
    expect(stars(0)).toBe('☆'.repeat(8))
  })
})

describe('toTree', () => {
  it('builds groups, ratings and notes', () => {
    expect(toTree({ Web: { React: 6, Level: 'junior', Empty: null } })).toEqual([
      {
        label: 'Web',
        children: [
          { label: 'React', rating: 6, children: [] },
          { label: 'Level', note: 'junior', children: [] },
          { label: 'Empty', children: [] },
        ],
      },
    ])
  })

  it('treats array items as child nodes', () => {
    const [root] = toTree({ Frameworks: ['React', { Vue: 2 }] })
    expect(root.children).toEqual([
      { label: 'React', children: [] },
      { label: 'Vue', rating: 2, children: [] },
    ])
  })

  it('tidies whitespace in labels', () => {
    expect(toTree({ ' CSS  ': { '@media queries ': 1 } })[0]).toMatchObject({
      label: 'CSS',
      children: [{ label: '@media queries' }],
    })
  })
})

describe('getStats', () => {
  it('counts rated skills and averages them', () => {
    expect(getStats({ A: { x: 2, y: 4, group: { z: 6 } }, note: 'hi' })).toEqual({ skills: 3, average: 4 })
  })
})

describe('toAsciiTree', () => {
  it('draws box characters with ratings', () => {
    expect(toAsciiTree({ Root: { A: 1, B: { C: 8 } } })).toBe(
      ['└─ Root', '   ├─ A  ★☆☆☆☆☆☆☆ 1/8', '   └─ B', '      └─ C  ★★★★★★★★ 8/8'].join('\n'),
    )
  })
})

describe('toPlantUml', () => {
  const lines = (data, options) => toPlantUml(data, options).split('\n')

  it('wraps the diagram in mindmap markers with title and legend', () => {
    const uml = lines({ Root: { A: 1 } })
    expect(uml[0]).toBe('@startmindmap')
    expect(uml).toContain("title Rika's Skill-visualizer")
    expect(uml).toContain('  Rika©')
    expect(uml.at(-1)).toBe('@endmindmap')
  })

  it('draws a rating as an unboxed child line', () => {
    const uml = lines({ Root: { React: 3 } }, { balanced: false })
    expect(uml).toContain('***_ <color:#b22746>★★★☆☆☆☆☆')
    expect(uml.some((line) => /^\*\*\[#[0-9a-f]{6}\] <color:#464547>React$/.test(line))).toBe(true)
  })

  it('does not invent a rating for groups whose name contains a digit (regression)', () => {
    const uml = toPlantUml({ Root: { HTML5: { Canvas: 4 } } })
    expect(uml).toContain('<color:#464547>HTML5')
    expect(uml.match(/\*_ /g)).toHaveLength(1)
  })

  it('splits a single root into two balanced sides', () => {
    const uml = lines({ Root: { A: { a1: 1, a2: 1 }, B: { b1: 1 }, C: { c1: 1 } } })
    const left = uml.indexOf('left side')
    expect(left).toBeGreaterThan(-1)
    expect(uml.findIndex((line) => line.endsWith('>B'))).toBeGreaterThan(left)
    expect(uml.findIndex((line) => line.endsWith('>A'))).toBeLessThan(left)
  })

  it('keeps everything on one side when balanced is off', () => {
    expect(toPlantUml({ Root: { A: 1, B: 2, C: 3 } }, { balanced: false })).not.toContain('left side')
  })

  it('makes deeper levels lighter', () => {
    const colors = lines({ Root: { Group: { Skill: 1 } } }, { balanced: false })
      .map((line) => line.match(/\[(#[0-9a-f]{6})\]/)?.[1])
      .filter(Boolean)
    const brightness = (hex) => parseInt(hex.slice(1, 3), 16) + parseInt(hex.slice(3, 5), 16) + parseInt(hex.slice(5, 7), 16)
    expect(colors).toHaveLength(3)
    expect(brightness(colors[0])).toBeLessThan(brightness(colors[1]))
    expect(brightness(colors[1])).toBeLessThan(brightness(colors[2]))
  })
})

describe('escapeCreole', () => {
  it('escapes PlantUML markup so labels render literally', () => {
    expect(escapeCreole('**bold**')).toBe('~**bold~**')
    expect(escapeCreole('<div>')).toBe('~<div>')
    expect(escapeCreole('[[link]]')).toBe('~[~[link]]')
    expect(escapeCreole('Node.js')).toBe('Node.js')
  })
})

describe('lighten', () => {
  it('mixes a colour with white', () => {
    expect(lighten('#00abf5', 0)).toBe('#00abf5')
    expect(lighten('#00abf5', 1)).toBe('#ffffff')
  })
})
