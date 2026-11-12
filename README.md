# Rika's Skill-visualizer

Turn a JSON list of skills into a mind map – every skill rated from 0 to 8 stars.

**Live:** https://mazsola739.github.io/Skill-visualizer/

> This was my very first React project =) – later refreshed with Vite, React 19, tests and a new UI.

## How it works

1. Paste your skills as JSON into the editor (or load one of the examples, or open a `.json` file).
2. Press **Visualize** (or <kbd>Ctrl</kbd> + <kbd>Enter</kbd>).
3. Each map can be viewed as a **mind map** image, an ASCII **tree**, the generated **PlantUML** source, or the **JSON** itself.

The JSON is converted to [PlantUML](https://plantuml.com/mindmap-diagram) mind map syntax and drawn by the public
PlantUML server, so the JSON you visualize is sent to plantuml.com.

## JSON format

```json
{
  "My skills": {
    "Frontend": {
      "React": 6,
      "CSS": { "Flexbox": 7, "Grid": 5 }
    },
    "Level": "junior",
    "Tools": ["Git", "npm"]
  }
}
```

| Value                    | Shown as                                 |
| ------------------------ | ---------------------------------------- |
| object                   | a group of skills                        |
| number (`0`–`8`)         | a star rating, e.g. `★★★★★★☆☆` for 6     |
| text                     | a small note under the skill             |
| array                    | plain items without rating               |
| array of skill objects   | several mind maps at once (top level)    |

Ratings above 8 are shown as 8, negative ones as 0.

## Development

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev        # start the dev server
npm test           # run the tests (Vitest)
npm run build      # production build into dist/
npm run deploy     # build and publish dist/ to GitHub Pages
```

## Project structure

```
src/
  App.jsx               page layout and state
  components/           editor, mind map card, diagram, copy button
  lib/skillMap.js       JSON → tree / ASCII tree / PlantUML conversion
  lib/plantuml.js       PlantUML server URLs
  lib/parseInput.js     editor input validation
  data/                 Rika's skill maps and examples
```
