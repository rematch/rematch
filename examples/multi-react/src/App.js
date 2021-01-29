import React from 'react'
import Left, { store as leftStore } from './LeftStore'
import Right, { store as rightStore } from './RightStore'

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
