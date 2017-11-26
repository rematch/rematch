import { PluginCreator } from '../typings'
import dispatchPlugin from './dispatch'
import effectsPlugin from './effects'

const corePlugins: PluginCreator[] = [
  dispatchPlugin,
  effectsPlugin,
]

export default corePlugins
