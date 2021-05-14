import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/integration/react'

import App from './AppWithHooks'
import AppWithoutHooks from './AppWithoutHooks'
import './index.css'
import './switch.css'

import { store } from './store'

const persistor = getPersistor()
const PreviewSelector = () => {
	const [showHooks, setShowHooks] = useState<boolean>(true)
	useEffect(() => {
		persistor.persist()
	}, [])
	return (
		<PersistGate loading={'loading'} persistor={persistor}>
			<div>
				<button type="button" onClick={() => setShowHooks(true)}>
					Show Application with hooks
				</button>
				<button type="button" onClick={() => setShowHooks(false)}>
					Show Application with classes
				</button>
				{showHooks ? <App /> : <AppWithoutHooks />}
			</div>
		</PersistGate>
	)
}

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<PreviewSelector />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
