import init from './init'
import model from './model'
import { getStore } from './store'
import { pluginExports } from './plugins'
import selectorsPlugin from '../src/plugins/selectors'
import dispatchPlugin from '../src/plugins/dispatch'
import effectsPlugin from '../src/plugins/effects'
import hooksPlugin from '../src/plugins/hooks'

const plugins = {
  selectorsPlugin,
  dispatchPlugin,
  effectsPlugin,
  hooksPlugin,
}

export default {
  init,
  model,
  getStore,
  pluginExports,
  plugins
}

export {
  init,
  model,
  getStore,
  pluginExports,
  plugins
}
