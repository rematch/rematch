import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init, model, getStore } from '@rematch/core'
import createPersistPlugin, { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import App from './App'

const persistPlugin = createPersistPlugin({
  version: 1,
  whiteList: ['persisted']
})

init({
  plugins: [persistPlugin],
})

// models
model({
  name: 'persisted',
  state: { a: 1 },
  reducers: {
    addOne: s => s.a + 1,
  }
})

model({
  name: 'notPersisted',
  state: { b: 2 },
  reducers: {
    addOne: s => s.b + 1,
  }
})

ReactDOM.render(
  <Provider store={getStore()}>
    <PersistGate persistor={getPersistor()}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
