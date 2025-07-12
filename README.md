# 🗺️ Gulf of Mexico Label Fixer – Chrome Extension

A lightweight Chrome Extension that restores the correct name **"Gulf of Mexico"** on Google Maps by replacing any incorrect instance of **"Gulf of America"**. It overlays a clear, styled label that adapts to zoom level and map updates.

---

## ✨ Features

- ✅ Replaces "Gulf of America" with "Gulf of Mexico" in text elements
- 🧠 Adds a persistent overlay label directly on the map
- 🔁 Auto-updates with page changes and zoom interactions
- 💻 Runs only on `https://www.google.com/maps/`

---

## 🧩 Installation

### 🔌 From Source (Developer Mode)

1. Clone or download this repo
2. Open `chrome://extensions/` in your browser
3. Enable **Developer Mode** (toggle in top right)
4. Click **“Load unpacked”**
5. Select the folder containing this repo

---

## 📁 File Structure

```plaintext
gulf-of-mexico-extension/
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── content-script.js
├── manifest.json
├── privacy.html
├── README.md

````

---

## 🔐 Permissions

* **Host Permission**:
  `"https://www.google.com/maps/*"` – Required to access and modify content on Google Maps.

* **Scripting Permission**:
  Allows the extension to inject and execute the script that performs DOM manipulation and label injection.

---

## 💡 How It Works

The extension:

* Uses a `MutationObserver` to detect changes in the map and DOM
* Walks through the text nodes to replace incorrect labels
* Injects a custom overlay based on the current zoom level and location

It mimics behavior similar to the [Gulf of Mexico Reverter](https://addons.mozilla.org/en-US/firefox/addon/gulf-of-mexico-reverter/) add-on for Firefox.

---

## 🛠️ Development

* JavaScript only (no build step)
* Tested on Chrome and Chromium-based browsers

To update or test changes:

* Make your edits
* Refresh the extension in `chrome://extensions/`

---

## 🙌 Contributing

Feel free to fork, improve, or suggest features.
Pull requests are welcome!

---

## 📄 License

[MIT](./LICENSE)

---

## ✉️ Contact

Made with love by [Andres Z.](https://github.com/andresz74)
Email: `azenteno74@gmail.com`
