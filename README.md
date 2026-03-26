# Jim Rotha Complete Portfolio

This folder contains everything in one project.

## Files
- index.html -> main HTML
- styles.css -> custom styling and animations
- app.js -> React frontend
- server.js -> backend for Telegram form submit
- package.json -> project dependencies
- .env.example -> rename to .env and put your real Telegram token

## How to run
1. Extract the ZIP
2. Open the folder in VS Code
3. Run:
   npm install
4. Rename `.env.example` to `.env`
5. Put your real Telegram token in `.env`
6. Run:
   npm start
7. Open:
   http://localhost:3000

## Important
- Do not open with Live Server if you want the form to submit to Telegram.
- Use http://localhost:3000
- The CV button still uses your current Google Drive folder link. Replace it in `app.js` with a direct file link for auto-download.
