# 🔐 VaultKey

A private, browser-based password generator and password strength checker. Built with plain HTML, CSS, and JavaScript — no framework, backend, account, build step, or external runtime dependency required.

[![GitHub](https://img.shields.io/badge/GitHub-Zakariaelqannaa--dv-181717?logo=github)](https://github.com/Zakariaelqannaa-dv/vaultkey)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

---

## ✨ Features

- **Generate passwords** from 8 to 64 characters.
- **Choose character sets** — uppercase, lowercase, numbers, and symbols.
- **Exclude ambiguous characters** such as `O`, `0`, `l`, and `1`.
- **Guarantee at least one character** from every selected set.
- **Cryptographically secure randomness** via the Web Crypto API (`crypto.getRandomValues`) with rejection sampling for unbiased selection and secure shuffling.
- **Copy to clipboard** with a single click.
- **Show / hide** generated passwords and checker input.
- **Strength checker** that evaluates length, character variety, repetition, common words, keyboard patterns, and simple sequences — entirely locally.
- **Responsive layout** with keyboard-accessible controls.

## 🚀 Getting started

No build step or dependencies. Just open the app in a browser.

### Option 1 — Open directly

1. Download or clone this repository.
2. Open `index.html` in any modern browser.

### Option 2 — Local server (recommended for clipboard support)

```bash
# Windows
py -m http.server 5500
# or
python -m http.server 5500

# macOS / Linux
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

## 🧩 Usage

1. Adjust the length slider and toggle the character sets you want.
2. Optionally enable "exclude ambiguous characters".
3. Click **Generate** to create a password, then **Copy** to copy it.
4. Use the strength checker to evaluate any password you type.

## 🔒 Privacy & security notes

- Password generation and checking happen **entirely in the browser**. There is no server code and no password-related network requests.
- The app **does not save passwords** in local storage, cookies, or a database.
- Google Fonts are loaded from Google Fonts when internet access is available. **No password is sent to Google Fonts.** For a fully offline setup, remove the two Google Fonts `<link>` elements from `index.html`; the interface will use system fallbacks.
- The strength checker is a **lightweight heuristic**, not a password-cracking simulator, breach database lookup, or security guarantee. It cannot tell whether a password has appeared in a data breach. Do not reuse passwords between accounts, and consider using a reputable password manager.
- Use a **modern browser**. Clipboard permissions are more reliable on `http://localhost` or HTTPS.

## 📁 Project structure

| File | Description |
|------|-------------|
| `index.html` | Page structure and controls. |
| `styles.css` | Responsive visual system and styling. |
| `app.js` | Secure generation, clipboard behavior, and local strength heuristics. |
| `favicon.svg` | VaultKey icon. |

## 🌐 Browser support

Any modern browser supporting the Web Crypto API (`crypto.getRandomValues`) and the Clipboard API. Chrome, Edge, Firefox, and Safari are all supported.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request.

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details. *(Add a `LICENSE` file if you want to apply the MIT license.)*

## 👤 Author

**Zakaria El Qannaa**

- GitHub: [@Zakariaelqannaa-dv](https://github.com/Zakariaelqannaa-dv)
- Repository: [vaultkey](https://github.com/Zakariaelqannaa-dv/vaultkey)