import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import createUpdatedPlugin from '@rematch/updated'

import * as models from './models'
import App from './App'

const store = init({
	models,
	// create plugin
	plugins: [createUpdatedPlugin()], // add to plugin list
})

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
