export class FpsCounter {
	#lastTime = 0
	#frames = 0
	#fps = 0

	start() {
		this.#lastTime = performance.now()
		this.#frames = 0
		this.#fps = 0
	}

	tick() {
		this.#frames++

		const now = performance.now()
		const delta = now - this.#lastTime

		if (delta >= 1000) {
			this.#fps = (this.#frames / delta) * 1000
			console.log(`FPS: ${this.#fps.toFixed(1)}`)
			this.#frames = 0
			this.#lastTime = now
		}
	}

	getFPS() {
		return this.#fps
	}
}
