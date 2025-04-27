# webm-hero

🚀 Minimal project that compiles **libvpx** (VP8/VP9) into **WebAssembly**, and demonstrates **frame-accurate decoding** inside the browser.

---

## 📦 Installation

```bash
npm install
npx napa
```

(`napa` fetches `libvpx` v1.7.0 into `node_modules`)

---

## 🔨 Building

First, compile libvpx.wasm:

```bash
npm run build:emscripten
```

(This uses Docker with `trzeci/emscripten:1.38.48` to build WASM files into `/dist`)

Then, build the demo website:

```bash
npm run build
```

This outputs the built website to the `/x` folder.

---

## 🖥 Running locally

```bash
npm start
```

This command will:

- Start an HTTP server at `http://localhost:8080`
- Watch for file changes
- Automatically rebuild

---

## 🧠 Project structure

| Folder          | Purpose                                     |
|-----------------|---------------------------------------------|
| `s/`            | Source code (TypeScript)                     |
| `wasm-build/`   | WASM build setup (`build.sh`, wrapper code)  |
| `dist/`         | Emscripten output (`.wasm`, `.js`)           |
| `x/`            | Final built website (after `npm run build`)  |

---

## 📋 Requirements

- Docker installed (required for building WASM)
- Linux/macOS recommended (for the build scripts)

---

## ✨ Quick Example

```bash
npm install
npx napa
npm run build:emscripten
npm run build
npm start
```

Open your browser at [http://localhost:8080](http://localhost:8080).

Drag a `.webm` video into the page → Decoding happens **frame-by-frame** inside the browser with pure WASM! 🧡

---

## 🛠 Notes

- Requires `.webm` input (only VP8/VP9 supported currently)
- `.mp4` files won't work (requires separate H.264 decoder)
- Frame data returned as **RGB** (convert to YUV if needed)

---

## 📜 License

[MIT](LICENSE)
