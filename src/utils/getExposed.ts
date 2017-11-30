import { Exposed, PluginCreator } from '../typings/rematch'
import validate from './validate'

export default (plugins: PluginCreator[]) => plugins.reduce((exposed: Exposed, plugin: PluginCreator) => ({
  ...exposed,
  ...(plugin.expose || {}),
}), {
  validate,
})
