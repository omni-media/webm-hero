import {VpxDecoder} from "../vpx-decoder.js"

export class Player extends VpxDecoder {
	canvas = document.createElement("canvas")

	constructor() {
		super()
		this.canvas.width = 1920
		this.canvas.height = 1080
	}

	#ctx = this.canvas.getContext("2d")
	#playing = false

	async play() {
		if(this.demuxer.source && this.info && !this.#playing) {
			this.#playing = true
			const videoInfo = this.info.streams.find(stream => stream.codec_type_string === "video")
			const framerate = this.parseFramerate(videoInfo?.avg_frame_rate!)
			const start = this.currentFrame * (1 / framerate)
			const reader = this.demuxer.readVideoPacket(start, undefined).getReader()

			while(true) {
				const {done, value} = await reader.read()
				if(value) {
					if(start <= value.timestamp) {
						const frameNumber = Math.round(value.timestamp * framerate)
						this.currentFrame = frameNumber
						const frame = this.decode(value.data)
						this.#ctx!.putImageData(frame, 0, 0)
					}
				}
				if(done || !this.#playing) {
					await reader.cancel()
					break
				}
			}
		}
	}

	get context() {
		return this.#ctx
	}

	pause() {
		this.#playing = false
	}
}
