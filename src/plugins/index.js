import dispatch from './dispatch'
import effects from './effects'
import subscriptions from './subscriptions'
import selectors from './selectors'

const corePlugins = [
  dispatch,
  effects,
  selectors,
  subscriptions,
]

export default corePlugins
