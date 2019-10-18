import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import createUpdatedPlugin from '@rematch/updated'
import App from './App'
import * as models from './models'

// create plugin
const updated = createUpdatedPlugin()

const store = init({
	models,
	plugins: [updated], // add to plugin list
})

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
