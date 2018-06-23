const package = require('../package.json')

if (package.version.includes('beta')) {
	console.warn(`WARNING - BREAKING CHANGE:
    global imports of "dispatch" and "getState" have been removed in @rematch/core 1.0.0-beta.3.
    
    See the CHANGELOG for details including a quick fix:
    https://github.com/rematch/rematch/blob/master/CHANGELOG.md
  `)
}
