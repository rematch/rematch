import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import createUpdatedPlugin from '@rematch/updated'
import * as models from './models'
import App from './App'

// create plugin
const updated = createUpdatedPlugin()

const store = init({
	models,
	plugins: [updated], // add to plugin list
})

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
				<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
