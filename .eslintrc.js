module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		'airbnb-base',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'no-restricted-syntax': 0,
		'lines-between-class-members': [
			'error',
			'always',
			{ exceptAfterSingleLine: true },
		],
		'no-param-reassign': 0,
		'no-use-before-define': 1,
		'@typescript-eslint/ban-types': 1,
		'@typescript-eslint/ban-ts-comment': 0,
		'no-shadow': 1,
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
			},
		],
		'no-underscore-dangle': [
			'error',
			{ allow: ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] },
		],
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-use-before-define': ['error', { functions: false }],
	},
}
