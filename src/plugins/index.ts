import { PluginCreator } from '../typings/rematch'
import dispatchPlugin from './dispatch'
import effectsPlugin from './effects'

const corePlugins: PluginCreator[] = [
  dispatchPlugin,
  effectsPlugin,
]

export default corePlugins
