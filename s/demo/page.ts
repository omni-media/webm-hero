
import {ShadowElement, html, css, mixin, cssReset} from "@benev/slate"
import {Player} from "../decoder/parts/player.js"

@mixin.reactive()
export class DemoPage extends ShadowElement {
	player = new Player()

	constructor() {
		super()
		setInterval(() => {
			this.requestUpdate()
		}, 100)
	}

	static get styles() {
		return css`
			${cssReset}

			:host {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 1em;
			}

			canvas {
				width: 640px;
				height: 480px;
				background: black;
			}
		`
	}

	onFileInputChange(e: Event) {
		const input = e.target as HTMLInputElement
		const file = input.files?.[0]
		if(file) {
			this.player.loadVideo(file)
		}
	}

	async seek() {
		this.player.pause()
		const input = this.shadowRoot?.querySelector(".seekto") as HTMLInputElement
		const value = +input.value

		const frame = await this.player.seekToFrame(value)
		if(frame)
			this.player.context?.putImageData(frame, 0, 0)
	}

	render() {
		const frames = this.player.mediainfo?.streams.find(v => v.codec_type_string === "video")?.nb_frames ?? 0
		return html`
			<label>Only vp8 compatible containers (webm, mkv ...)</label>
			<input @change=${this.onFileInputChange} type="file" class="file-input" accept="image/*, video/webm, .mp3">
			${this.player.canvas}
			<span>current frame: ${this.player.currentFrameNumber}</span>
			<span>amount of frames: ${frames}</span>
			<div>
				<button @click=${() => this.player.play()}>Play</button>
				<button @click=${() => this.player.pause()}>Pause</button>
			</div>
			<div>
				<label>seek to frame:</label>
				<div>
					<input min="0" max=${frames} value="0" type="number" class="seekto">
					<button @click=${this.seek} class="seek-btn">seek</button>
				</div>
			</div>
		`
	}
}
