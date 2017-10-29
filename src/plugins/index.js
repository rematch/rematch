import dispatchPlugin from './dispatch'
import effectsPlugin from './effects'
import subscriptionsPlugin from './subscriptions'
import selectorsPlugin from './selectors'

const corePlugins = [
  dispatchPlugin,
  effectsPlugin,
  selectorsPlugin,
  subscriptionsPlugin,
]

export default corePlugins
