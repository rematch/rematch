import dispatchPlugin from './dispatch'
import effectsPlugin from './effects'
import { PluginCreator } from '../typings'

const corePlugins: PluginCreator[] = [
  dispatchPlugin,
  effectsPlugin,
]

export default corePlugins
