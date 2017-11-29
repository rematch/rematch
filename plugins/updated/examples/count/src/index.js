import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init, getStore } from '@rematch/core'
import createUpdatedPlugin from '@rematch/updated'
import App from './App'
import * as models from './models'

// create plugin
const updated = createUpdatedPlugin()

init({
  models,
  plugins: [updated] // add to plugin list
})

ReactDOM.render(
  <Provider store={getStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
)
