import * as R from './typings'
import validate from './utils/validate'

/**
 * PluginFactory
 *
 * makes Plugin objects extend and inherit from a root PluginFactory
 */
export default (config: R.Config) => ({
	config,
	/**
	 * validate
	 *
	 * bind validate to the store for easy access
	 */
	validate,
	extraArguments: {},
	/**
	 * create plugin
	 *
	 * binds plugin properties and functions to an instance of PluginFactorys
	 * @param plugin
	 */
	create(plugin: R.Plugin): R.Plugin {
		validate([
			[
				plugin.onStoreCreated && typeof plugin.onStoreCreated !== 'function',
				'Plugin onStoreCreated must be a function',
			],
			[
				plugin.onModel && typeof plugin.onModel !== 'function',
				'Plugin onModel must be a function',
			],
			[
				plugin.middleware && typeof plugin.middleware !== 'function',
				'Plugin middleware must be a function',
			],
		])

		if (plugin.onInit) {
			plugin.onInit.call(this)
		}

		const result: R.Plugin | any = {}

		const exposed = {}
		if (plugin.exposed) {
			for (const key of Object.keys(plugin.exposed)) {
				exposed[key] =
					typeof plugin.exposed[key] === 'function'
						? plugin.exposed[key].bind(this) // bind functions to plugin class
						: Object.create(plugin.exposed[key]) // add exposed to plugin class
			}
		}

		const extraArguments = this.extraArguments
		if (plugin.extraArguments) {
			for (const key of Object.keys(plugin.extraArguments)) {
				extraArguments[key] =
					typeof plugin.extraArguments[key] === 'function'
						? plugin.extraArguments[key].bind(this) // bind functions to plugin class
						: plugin.extraArguments[key]
			}
		}

		Object.assign(this, {
			...exposed,
			config,
			validate,
			extraArguments,
		})

		for (const method of ['onModel', 'middleware', 'onStoreCreated']) {
			if (plugin[method]) {
				result[method] = plugin[method].bind(this)
			}
		}
		return result
	},
})
