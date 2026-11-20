# VaultKey

A private, browser-based password generator and password strength checker. Built with plain HTML, CSS, and JavaScript; no framework, backend, account, build step, or external runtime dependency is required.

## Run in Trae

1. Extract the `vaultkey` folder.
2. Open the folder in Trae.
3. Open `index.html` in a browser, or use Trae's Live Server/local preview if available.
4. For a local server from the project folder, run:

   ```bash
   On Windows, use `py -m http.server 5500` (or `python -m http.server 5500`).

   On macOS/Linux, use `python3 -m http.server 5500`.
   ```

   Then open `http://localhost:5500`.

## Features

- Generate passwords from 8 to 64 characters.
- Choose uppercase, lowercase, numbers, and symbols.
- Optionally exclude ambiguous characters such as `O`, `0`, `l`, and `1`.
- Guarantee at least one character from every selected character set.
- Use the browser Web Crypto API (`crypto.getRandomValues`) and rejection sampling for unbiased character selection; shuffle with cryptographically secure random values.
- Copy the generated password to the clipboard.
- Show or hide generated passwords and checker input.
- Check a user-entered password locally for length, character variety, repetition, common words, keyboard patterns, and simple sequences.
- Responsive layout and keyboard-accessible controls.

## Privacy and security notes

- Password generation and checking happen in the browser. This project contains no server code and makes no password-related network requests.
- The app does not save passwords in local storage, cookies, or a database.
- Google Fonts are loaded from Google Fonts when internet access is available. No password is sent to Google Fonts. For a fully offline setup, remove the two Google Fonts `<link>` elements from `index.html`; the interface will use system fallbacks.
- The strength checker is a lightweight heuristic, not a password-cracking simulator, breach database lookup, or security guarantee. It cannot tell whether a password has appeared in a data breach. Do not reuse passwords between accounts, and consider using a reputable password manager.
- Use a modern browser. Clipboard permissions are more reliable on `http://localhost` or HTTPS.

## Project files

- `index.html` — page structure and controls.
- `styles.css` — responsive visual system and styling.
- `app.js` — secure generation, clipboard behavior, and local strength heuristics.
- `favicon.svg` — VaultKey icon.

## Author

[Zakaria El Qannaa](https://github.com/Zakariaelqannaa-dv) — [@Zakariaelqannaa-dv](https://github.com/Zakariaelqannaa-dv)
