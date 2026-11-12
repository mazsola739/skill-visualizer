import plantumlEncoder from 'plantuml-encoder'

const SERVER = 'https://www.plantuml.com/plantuml'

/** Image / editor URLs on the public PlantUML server for a diagram source. */
export const plantUmlUrls = (source) => {
  const encoded = plantumlEncoder.encode(source)
  return {
    svg: `${SERVER}/svg/${encoded}`,
    png: `${SERVER}/png/${encoded}`,
    editor: `${SERVER}/uml/${encoded}`,
  }
}
