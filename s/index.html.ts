
import {template, html, easypage, headScripts, git_commit_hash, read_file} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()

	return easypage({
		path,
		dark: true,
		title: "webm-hero",
		css: "demo/style.css",
		head: html`
			<meta data-commit-hash="${hash}"/>

			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Share+Tech&display=swap" rel="stylesheet">

			${headScripts({
				devModulePath: await path.version.root("demo/main.js"),
				prodModulePath: await path.version.root("demo/main.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<main>
				<h1>webm-hero</h1>
				<p>see it on <a href="https://github.com/omni-media/webm-hero/">github</a></p>
				<demo-page></demo-page>
			</main>
		`,
	})
})

