import {VpxFrame} from './vpx-frame.js'
import {yuvToRgba} from './yuv-to-rgba.js'

export function getFrame(frame: VpxFrame) {
	const {Y, U, V} = frame.readYUV()

	const w = frame.width
	const h = frame.height

	const halfW = w >> 1
	const halfH = h >> 1

	const rgba = new Uint8ClampedArray(w * h * 4)

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const yIndex = y * w + x
			const uvIndex = (Math.floor(y / 2) * halfW) + Math.floor(x / 2)

			const Yval = Y[yIndex]
			const Uval = U[uvIndex]
			const Vval = V[uvIndex]

			const [r, g, b] = yuvToRgba(Yval, Uval, Vval)

			const pixelIndex = (y * w + x) * 4
			rgba[pixelIndex + 0] = r
			rgba[pixelIndex + 1] = g
			rgba[pixelIndex + 2] = b
			rgba[pixelIndex + 3] = 255
		}
	}

	const imageData = new ImageData(rgba, w, h)
	return imageData
}
