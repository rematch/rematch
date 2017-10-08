import init from './init'
import model from './model'
import { dispatch } from './dispatch'
import { view } from './view'

export default {
  init,
  i: init,
  model,
  m: model,
  dispatch,
  d: dispatch,
  view,
  v: view
}

export {
  init,
  init as i,
  model,
  model as m,
  dispatch,
  dispatch as d,
  view,
  view as v
}
