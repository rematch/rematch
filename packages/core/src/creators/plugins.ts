/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import * as R from '../typings'
import { validatePlugin } from '../utils/validate'
import dispatchPlugin from '../plugins/dispatch'
import effectsPlugin from '../plugins/effects'

const corePlugins: R.Plugin[] = [dispatchPlugin, effectsPlugin]

export function initializePlugin(rematch: R.Rematch, plugin: R.Plugin): void {
  validatePlugin(plugin)

  if (plugin.onInit) {
    plugin.onInit(rematch)
  }

  // add exposed to rematch class
  if (plugin.exposed) {
    for (const key of Object.keys(plugin.exposed)) {
      rematch[key] =
        typeof plugin.exposed[key] === 'function'
          ? (...params: any[]): any =>
              // insert rematch as the first argument of exposed function
              (plugin.exposed![key] as R.ExposedFunction)(rematch, ...params)
          : Object.create(plugin.exposed[key])
    }
  }
}

export default function(
  rematch: R.Rematch,
  userPlugins: R.Plugin[]
): R.Plugin[] {
  const plugins: R.PluginHooks[] = []

  for (const plugin of corePlugins.concat(userPlugins)) {
    initializePlugin(rematch, plugin)
    plugins.push(plugin)
  }

  return plugins
}
