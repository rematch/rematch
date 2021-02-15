/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

const getDirectories = (source) =>
	fs
		.readdirSync(source, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)

const README_FILE = path.join(process.cwd(), 'README.md')
getDirectories('./packages').forEach((pkg) => {
	const DIST_FOLDER = path.join(
		process.cwd(),
		'packages',
		pkg,
		'dist',
		'README.md'
	)
	try {
		fs.copyFileSync(README_FILE, DIST_FOLDER)
		if (fs.existsSync(DIST_FOLDER)) {
			console.log(`✨ Copied succesfully to: ${pkg}`)
		} else {
			console.warn(`⚠️ Error copying to: ${DIST_FOLDER}`)
		}
	} catch (error) {
		console.warn(`⚠️ Error copying to: ${DIST_FOLDER}, error: ${error.message}`)
	}
})
