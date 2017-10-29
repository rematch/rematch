import init from './init'
import model from './model'
import { getStore } from './utils/store'

import dispatchPlugin from './plugins/dispatch'
import selectPlugin from './plugins/selectors'

const { expose: { dispatch } } = dispatchPlugin
const { expose: { select } } = selectPlugin

export default {
  init,
  model,
  getStore,
  dispatch,
  select,
}

export {
  init,
  model,
  getStore,
  dispatch,
  select
}
