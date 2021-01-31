import React, { useState } from 'react'
import App from './AppWithHooks'
import AppWithoutHooks from './AppWithoutHooks'
import './index.css'
import './switch.css'

import { Provider } from 'react-redux'
import { store } from './store'

const PreviewSelector = () => {
	const [showHooks, setShowHooks] = useState<boolean>(true)

	return (
		<div>
			<button type="button" onClick={() => setShowHooks(true)}>
				Show Application with hooks
			</button>
			<button type="button" onClick={() => setShowHooks(false)}>
				Show Application with classes
			</button>
			{showHooks ? <App /> : <AppWithoutHooks />}
		</div>
	)
}

export const GlobalApp = () => (
	<Provider store={store}>
		<PreviewSelector />
	</Provider>
)
