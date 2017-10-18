import init from './init'
import model from './model'
import { getStore } from './utils/store'
import { pluginExports } from './core'

import { dispatch } from './plugins/dispatch'
import { select } from './plugins/selectors'

export default {
  init,
  model,
  getStore,
  pluginExports,
  dispatch,
  select,
}

export {
  init,
  model,
  getStore,
  pluginExports,
  dispatch,
  select
}
