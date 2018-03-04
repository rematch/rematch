import init from './init'
import dispatchPlugin from './plugins/dispatch'

const { expose: { dispatch } } = dispatchPlugin

export default {
  dispatch,
  init,
}

export {
  dispatch,
  init,
}
