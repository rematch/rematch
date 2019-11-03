import React from 'react'
import { AppRegistry, Text } from 'react-native'
import { Provider } from 'react-redux'

import { Navigator } from './src/rematch/navigator'
import store from './src/rematch'

class ReduxExampleApp extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<Navigator />
			</Provider>
		)
	}
}

AppRegistry.registerComponent('ReduxExample', () => ReduxExampleApp)

export default ReduxExampleApp
