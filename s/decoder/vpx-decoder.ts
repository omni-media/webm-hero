import type {WebDemuxer as Demuxer, WebMediaInfo} from "web-demuxer"
//@ts-ignore
import {WebDemuxer} from "web-demuxer/dist/web-demuxer.js"

//@ts-ignore
import Module from '../vpx/vpx.js'
import {VpxFrame} from "./parts/vpx-frame.js"
import {getFrame} from "./parts/get-frame.js"

//vp8 only for now
export class VpxDecoder {
	#module: any
	protected info: WebMediaInfo | null = null
	protected demuxer: Demuxer = new WebDemuxer({wasmLoaderPath: import.meta.resolve("web-demuxer/dist/wasm-files/ffmpeg.js")})

	protected currentFrame = 0

	constructor() {
		Module().then((m: any) => {
			this.#module = m
			this.#create()
		})
	}

	#create() {
		return this.#module._decoder_create()
	}

	decode(data: Uint8Array) {
		const ptr = this.#module._malloc(data.length)
		this.#module.HEAPU8.set(data, ptr)

		const success = this.#module._decoder_decode(ptr, data.length)

		this.#module._free(ptr)

		const pointer = this.#module._decoder_get_frame()
		const vpxFrame = new VpxFrame(this.#module, pointer)
		const frame = getFrame(vpxFrame)

		return frame
	}

	protected parseFramerate(avgFrameRate: string): number {
		const [numerator, denominator] = avgFrameRate.split('/').map(Number)
		if (!numerator || !denominator) throw new Error('Invalid avgFrameRate format')
		return numerator / denominator
	}

	get mediainfo() {
		return this.info
	}

	get currentFrameNumber() {
		return this.currentFrame
	}

	// frame accurate seeking
	async seekToFrame(targetFrameNumber: number) {
		if(this.demuxer.source && this.info) {
			const videoInfo = this.info.streams.find(stream => stream.codec_type_string === "video")
			const framerate = this.parseFramerate(videoInfo?.avg_frame_rate!)
			const targetSecond = targetFrameNumber * (1 / framerate)
			//const offset = 1 // 1 second
			const reader = this.demuxer.readVideoPacket(targetSecond, undefined).getReader()

			while(true) {
				const {done, value} = await reader.read()
				if(value) {
					const frameNumber = Math.round(value.timestamp * framerate)

					if(frameNumber === targetFrameNumber) {
						this.currentFrame = frameNumber
						const frame = this.decode(value!.data)
						await reader.cancel()
						return frame
					} else {
						this.decode(value.data)
					}
				} else if(done) {
					break
				}
			}
		}
	}

	#destroy() {
		return this.#module._decoder_destroy()
	}

	async loadVideo(file: File) {
		await this.demuxer.load(file)
		const info = await this.demuxer.getMediaInfo()
		this.info = info
	}
}
