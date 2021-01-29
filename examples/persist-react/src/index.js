import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import Spinner from 'react-spinkit'
import createPersistPlugin, { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import storage from 'redux-persist/lib/storage'
import * as models from './models'
import App from './App'

const persistPlugin = createPersistPlugin({
	key: 'root',
	storage,
	version: 2,
	whitelist: ['persisted'],
})

const store = init({
	models,
	plugins: [persistPlugin],
})

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={<Spinner />} persistor={getPersistor()}>
				<App />
			</PersistGate>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
