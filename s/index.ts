//@ts-ignore
import {WebDemuxer} from "web-demuxer/dist/web-demuxer.js"

//@ts-ignore
import Module from '../dist/my-module.js'
import {VpxDecoder} from './decoder/vpx-decoder.js'
import {VpxFrame} from "./decoder/parts/vpx-frame.js"
import {getFrame} from "./decoder/parts/get-frame.js"

const demuxer = new WebDemuxer({
	wasmLoaderPath: import.meta.resolve("web-demuxer/dist/wasm-files/ffmpeg.js"),
})

const canvas = document.querySelector("canvas")
const input = document.querySelector("input")
const ctx = canvas?.getContext("2d")

input?.addEventListener("change", async () => {
	const file = input.files?.[0]
	if(file) {
		await demuxer.load(file)
		const videoChunk = await demuxer.seekEncodedVideoChunk(5)
		const bytes = new Uint8Array(videoChunk.byteLength)
		videoChunk.copyTo(bytes)
		demo(bytes)
	}
})

async function demo(bytes: Uint8Array) {
	Module().then((module: any) => {
		const decoder = new VpxDecoder(module)

		decoder.create()

		const compressedFrame = bytes
		const success = decoder.decode(compressedFrame)

		if (success) {
			const framePtr = decoder.getFrame()
			console.log('Got decoded frame at ptr:', framePtr)
			if(framePtr) {
				const vpxFrame = new VpxFrame(module, framePtr)
				const frame = getFrame(vpxFrame)
				ctx?.putImageData(frame, 0, 0)
			}
		}

		decoder.destroy()
	})

}
