
import {Science, test, expect} from "@e280/science"
import {VpxDecoder} from "./decoder/vpx-decoder.js"

await Science.run({
	"instantiate decoder": test(async() => {
		const decoder = new VpxDecoder()
		expect(!!decoder).is(true)
	}),
})

