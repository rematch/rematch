/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import createPersistPlugin, { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import * as models from './models'
import App from './App'

const persistPlugin = createPersistPlugin({
	version: 2,
	whitelist: ['persisted'],
})

const store = init({
	models,
	plugins: [persistPlugin],
})

ReactDOM.render(
	<Provider store={store}>
		<PersistGate persistor={getPersistor()}>
			<App />
		</PersistGate>
	</Provider>,
	document.getElementById('root')
)
