import validate from './validate'
import { PluginCreator } from '../typings'

export default (plugins: PluginCreator[]) => plugins.reduce((exposed: any, plugin: PluginCreator) => ({
  ...exposed,
    ...(plugin.expose || {})
  }), {
    validate,
  })
