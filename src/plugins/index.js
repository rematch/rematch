import dispatch from './dispatch'
import effects from './effects'
import hooks from './hooks'
import selectors from './selectors'

const corePlugins = [
  dispatch,
  effects,
  selectors,
  hooks,
]

export default corePlugins
