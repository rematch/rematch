import React from 'react'

import Left from './containers/left'
import leftStore from './containers/left/store'

import Right from './containers/right'
import rightStore from './containers/right/store'

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'row',
	},
}

export default class App extends React.Component {
	onClick = () => {
		leftStore.dispatch.count.increment()
		rightStore.dispatch.count.increment()
		this.forceUpdate()
	}
	render() {
		return (
			<div style={styles.container}>
				<Left />
				<Right />
				<button onClick={this.onClick}>All</button>
			</div>
		)
	}
}
