
![](https://i.imgur.com/ZYWFcGJ.png)

# webm-hero

🚀 Minimal project that compiles **libvpx** (VP8/VP9) into **WebAssembly**, and demonstrates **frame-accurate decoding** inside the browser.

<br/>

## 🔧 Development instructions

- `npm i && npm run build` -- fully rebuild everything into `x/`
- `npm run build:web` -- web-only partial rebuild (ts, static site)
- `npm test` -- run test suite
- `npm start` -- run http and watch routines

<br/>

## 🛠 Notes

Drag a `.webm` video into the page → Decoding happens **frame-by-frame** inside the browser with pure WASM! 🧡

- Requires `.webm` input (only VP8/VP9 supported currently)
- `.mp4` files won't work (requires separate H.264 decoder)
- Frame data returned as **RGB** (convert to YUV if needed)

<br/>

## 📜 License

[MIT](LICENSE)

