import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init, model, getStore } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'
import App from './App'
import example from './example'

const loadingPlugin = createLoadingPlugin()

init({
  plugins: [loadingPlugin],
})

// models
model(example)

ReactDOM.render(
  <Provider store={getStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
)
