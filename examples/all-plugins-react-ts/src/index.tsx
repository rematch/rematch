import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import App from './AppWithHooks'
import AppWithoutHooks from './AppWithoutHooks'
import "./index.css";
import "./switch.css";

import { Provider } from 'react-redux'
import { store } from './store'

const PreviewSelector = () => {
	const [showHooks, setShowHooks] = useState<boolean>(true);

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
ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<PreviewSelector />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
