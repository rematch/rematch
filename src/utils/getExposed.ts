import { Exposed, PluginCreator } from '../../typings/rematch'
import validate from './validate'

export default <S>(plugins: Array<PluginCreator<S>>): Exposed<S> =>
  plugins.reduce((exposed: any, plugin: PluginCreator<S>) => ({
    ...exposed,
    ...(plugin.expose || {}),
  }), {
      validate,
    })
