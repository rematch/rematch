import { Model, Plugin } from '@rematch/core'
import validate from './validate'

const cachedTypings = {}

const typingsPlugin = (): Plugin => ({
	exposed: {
		typings: {},
	},
	onModel(model: Model) {
		cachedTypings[model.name] = model.typings
	},
	middleware: store => next => action => {
		const called = next(action)
		const [modelName, _] = action.type.split('/')
		const typings = cachedTypings[modelName]
		if (typings) {
			validate(typings, store.getState()[modelName], modelName)
		} else {
			console.warn(`[rematch]: Missing typings definitions for \`${modelName}\` model`)
		}
		return called
	},
})

export default typingsPlugin
