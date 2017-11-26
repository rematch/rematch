/* eslint-disable */
import { compose } from 'redux'

export const composeEnhancers = (devtoolOptions = {}) =>
    /* istanbul ignore next */
    (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
      : compose
