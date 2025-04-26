export function yuvToRgba(y: number, u: number, v: number): [number, number, number] {
	const c = y - 16
	const d = u - 128
	const e = v - 128

	const r = (298 * c + 409 * e + 128) >> 8
	const g = (298 * c - 100 * d - 208 * e + 128) >> 8
	const b = (298 * c + 516 * d + 128) >> 8

	return [
		Math.min(Math.max(r, 0), 255),
		Math.min(Math.max(g, 0), 255),
		Math.min(Math.max(b, 0), 255),
	]
}
