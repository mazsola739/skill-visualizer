// Parses the editor text into a list of skill maps, with readable error messages.

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

/**
 * Accepts one skill object, or an array of skill objects (each becomes its own mind map).
 * @returns {{ maps: object[] } | { error: string }}
 */
export const parseSkillJson = (text) => {
  if (!text.trim()) return { error: 'The editor is empty. Paste some JSON or pick an example.' }

  let value
  try {
    value = JSON.parse(text)
  } catch (error) {
    return { error: `This is not valid JSON: ${error.message}` }
  }

  const maps = Array.isArray(value) ? value : [value]
  if (maps.length === 0) return { error: 'The array is empty – add at least one skill object.' }
  if (!maps.every(isPlainObject)) {
    return { error: 'Expected an object like { "My skills": { "React": 5 } } (or an array of such objects).' }
  }
  if (maps.some((map) => Object.keys(map).length === 0)) {
    return { error: 'An empty object has nothing to draw – add at least one skill.' }
  }
  return { maps }
}
