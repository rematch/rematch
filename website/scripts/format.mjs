/* eslint-disable no-await-in-loop */
import fs from 'fs/promises'
import path from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import prettier from 'prettier'

async function ooop(f, file) {
	const pathToWrite = path.join('..', 'docs', f, file)
	let content = await fs.readFile(pathToWrite, 'utf-8')
	content = content.replace(
		/```(tsx|ts)/gi,
		(_, type) => `\`\`\`${type === 'tsx' ? 'jsx' : 'js'} %%`
	)
	content = prettier.format(content, {
		parser: 'markdown',
	})
	content = content.replace(
		/```(jsx|js) %%/gi,
		(_, type) => `\`\`\`${type === 'jsx' ? 'tsx' : 'ts'}`
	)

	await fs.writeFile(pathToWrite, content)
	console.log(`Written ${pathToWrite}`)
}

async function iterate(f = '') {
	const files = await fs.readdir(path.join('..', 'docs', f))
	for (const file of files) {
		if (!path.extname(file)) {
			iterate(file)
		} else {
			ooop(f, file)
		}
	}
}

iterate()
