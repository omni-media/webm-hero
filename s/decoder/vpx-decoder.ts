export class VpxDecoder {
	private module: any

	constructor(module: any) {
		this.module = module
	}

	create() {
		return this.module._decoder_create()
	}

	decode(data: Uint8Array) {
		const ptr = this.module._malloc(data.length)
		this.module.HEAPU8.set(data, ptr)

		const success = this.module._decoder_decode(ptr, data.length)

		this.module._free(ptr)

		return success
	}

	getFrame() {
		return this.module._decoder_get_frame()
	}

	destroy() {
		return this.module._decoder_destroy()
	}
}
