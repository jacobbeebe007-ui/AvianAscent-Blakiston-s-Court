Avian Ascent Refactored Project

Structure
- index.html
- css/main.css
- css/sprites.css
- css/battle.css
- css/shop.css
- css/ui.css
- js/core/game.js
- js/data/content.js
- js/systems/systems.js
- js/systems/shop.js
- js/systems/fixes.js
- js/ui/ui.js
- js/ui/sprites.js

Notes
- This is a real consolidation refactor from the split project zip.
- Original execution order was preserved inside each bundle.
- The goal is to make future maintenance easier without changing runtime behavior.

Local Run / Preview
- This is a static HTML/CSS/JS game.
- Start a local server:
  - `npm run dev`
  - or `PORT=8080 npm run dev`
- Open:
  - `http://localhost:8000` (or your chosen port)

Mobile on same Wi-Fi
- Start with `npm run dev` (binds to `0.0.0.0`).
- Find your computer's LAN IP (example `192.168.1.25`).
- On phone browser open `http://192.168.1.25:8000`.
