
import {Science, test, expect} from "@e280/science"

await Science.run({
	"test suite runs": test(async() => {
		expect(true).ok()
	}),
})

