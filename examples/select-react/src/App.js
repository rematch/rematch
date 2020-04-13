import React from 'react'
import { connect } from 'react-redux'
import { select } from './store'

// Make a presentational component.
// It knows nothing about redux or rematch.
const App = ({ total, items, add, remove }) => {
	const [value, setValue] = React.useState(1)
	return (
		<div>
			<h2>
				Cart has{' '}
				<b style={{ backgroundColor: '#dde', padding: 5 }}>
					{items.length} items
				</b>{' '}
				with a total value of{' '}
				<b style={{ backgroundColor: '#aae', padding: 5 }}>{total}</b>
			</h2>

			<h2>
				<input
					value={value}
					onChange={event => setValue(Number(event.target.value))}
				/>
				<button onClick={() => add({ id: Date.now(), value })}>Add Item</button>{' '}
			</h2>

			<h5>
				{items.map(item => (
					<button
						key={item.id}
						onClick={() => remove(item)}
						style={{ backgroundColor: 'yellow', marginRight: 10 }}
					>
						{item.value}
					</button>
				))}
			</h5>
		</div>
	)
}

const mapState = select(models => ({
	total: models.cart.total,
	items: models.cart.items,
}))

const mapDispatch = dispatch => ({
	add: dispatch.cart.add,
	remove: dispatch.cart.remove,
})

// Use react-redux's connect
export default connect(
	mapState,
	mapDispatch
)(App)
