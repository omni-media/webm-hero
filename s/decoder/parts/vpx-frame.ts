export class VpxFrame {
	private module: any
	private ptr: number

	width: number
	height: number
	yPtr: number
	uPtr: number
	vPtr: number
	yStride: number
	uStride: number
	vStride: number

	constructor(module: any, framePtr: number) {
		this.module = module
		this.ptr = framePtr

		const HEAPU32 = this.module.HEAPU32
		const base = framePtr >> 2

		// Width and height: use correct fields
		this.width = HEAPU32[base + 6]
		this.height = HEAPU32[base + 7]

		// Planes (offset +48 bytes)
		const planesBase = (framePtr + 48) >> 2
		this.yPtr = HEAPU32[planesBase + 0]
		this.uPtr = HEAPU32[planesBase + 1]
		this.vPtr = HEAPU32[planesBase + 2]

		// Strides (offset +64 bytes)
		const stridesBase = (framePtr + 64) >> 2
		this.yStride = HEAPU32[stridesBase + 0]
		this.uStride = HEAPU32[stridesBase + 1]
		this.vStride = HEAPU32[stridesBase + 2]
	}

	readPlane(ptr: number, stride: number, width: number, height: number) {
		const out = new Uint8Array(width * height)
		const HEAPU8 = this.module.HEAPU8

		for (let y = 0; y < height; y++) {
			const srcOffset = ptr + y * stride
			const dstOffset = y * width
			for (let x = 0; x < width; x++) {
				out[dstOffset + x] = HEAPU8[srcOffset + x]
			}
		}

		return out
	}

	readYUV() {
		const w = this.width
		const h = this.height
		const halfW = w >> 1
		const halfH = h >> 1

		const Y = this.readPlane(this.yPtr, this.yStride, w, h)
		const U = this.readPlane(this.uPtr, this.uStride, halfW, halfH)
		const V = this.readPlane(this.vPtr, this.vStride, halfW, halfH)

		return {Y, U, V}
	}
}
