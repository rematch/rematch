import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'
import App from './App'
import example from './example'

const loadingPlugin = createLoadingPlugin({ asNumber: true })

const store = init({
  plugins: [loadingPlugin],
  models: { example }
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
