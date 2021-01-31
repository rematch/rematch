import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'
import * as models from './models'
import App from './App'

const loadingPlugin = createLoadingPlugin({ asNumber: true })

const store = init({
	models,
	plugins: [loadingPlugin],
})

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
