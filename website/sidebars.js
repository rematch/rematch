module.exports = {
	docs: {
		Rematch: ['introduction'],
		'Getting Started': [
			'installation',
			'typescript',
			// 'Configuration',
		],
		'API Reference': [
			'api-reference/index',
			'api-reference/models',
			'api-reference/redux',
			'api-reference/store',
			'api-reference/plugins',
		],
		Plugins: [
			'plugins/index',
			'plugins/immer',
			'plugins/select',
			'plugins/loading',
			'plugins/updated',
			'plugins/persist',
			'plugins/typed-state',
		],
		Recipes: [
			'recipes/redux-devtools',
			'recipes/testing',
			'recipes/redux-plugins',
		],
		Migrating: ['migrating/from-redux', 'migrating/from-v1-to-v2'],
	},
}
