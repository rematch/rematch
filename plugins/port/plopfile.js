const packagePrompts = [
	{
		type: 'input',
		name: 'pluginName',
		message: 'plugin name',
	},
	{
		type: 'input',
		name: 'desc',
		message: 'description',
		default: '',
	},
	{
		type: 'input',
		name: 'author',
		message: 'author',
	},
]

const modelPrompts = [
	{
		type: 'confirm',
		name: 'combinesReducers',
		message: 'Does the library have its own combineReducers?',
		default: false,
	},
	{
		type: 'confirm',
		name: 'augmentsRootReducer',
		message: 'Does the library wrap the root reducer?',
		default: false,
	},
	{
		type: 'confirm',
		name: 'augmentsModelReducers',
		message: 'Does the library wrap individual model reducers?',
		default: false,
	},
	{
		type: 'confirm',
		name: 'hasReducer',
		message: 'Does the library provide its own reducer?',
		default: answers =>
			!(answers.augmentsRootReducer || answers.augmentsModelReducers),
	},
	{
		type: 'confirm',
		name: 'hasActionCreators',
		message: 'Does the library provide action creators?',
		default: answers =>
			answers.augmentsRootReducer ||
			answers.augmentsModelReducers ||
			answers.hasReducer,
	},
	{
		type: 'input',
		name: 'modelName',
		message: 'What model name should the plugin use?',
		default: answers => answers.pluginName,
		when: answers => answers.hasReducer || answers.hasActionCreators,
	},
	{
		type: 'confirm',
		name: 'hasMiddleware',
		message: 'Does the library provide redux middleware?',
		default: false,
	},
]

module.exports = function(plop) {
	plop.setGenerator('port', {
		description: 'describes a redux library as an @rematch plugin',
		prompts: [...packagePrompts, ...modelPrompts],
		actions: [
			{
				type: 'add',
				path: 'src/recipe/{{pluginName}}.ts',
				templateFile: 'plop/recipe.ts.hbs',
			},
			{
				type: 'add',
				path: 'src/recipe/{{pluginName}}.test.ts',
				templateFile: 'plop/recipe.test.ts.hbs',
			},
		],
	})
}
