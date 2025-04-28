//import "@benev/slate/x/node.js"
import {template, html, easypage, headScripts, git_commit_hash, read_file, unsanitized, renderSocialCard} from "@benev/turtle"

const domain = "github.io"
const favicon = "/assets/e.png"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()

	return easypage({
		path,
		dark: true,
		title: "e280",
		head: html`
			<link rel="icon" href="${favicon}"/>
			<meta data-commit-hash="${hash}"/>

			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Share+Tech&display=swap" rel="stylesheet">

			${renderSocialCard({
				themeColor: "#3cff9c",
				siteName: "omnitool.com",
				title: "e280",
				description: "VP8/VP9 WebAssembly decoder",
				image: `https://${domain}${favicon}`,
				url: `https://${domain}/`,
			})}

			${headScripts({
				// wip
				devModulePath: await path.version.root("index.js"),
				prodModulePath: await path.version.root("index.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<section style="display: flex; flex-direction: column;">
				<demo-page></demo-page>
			</section>
		`,
	})
})
