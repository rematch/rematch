import React from 'react'
import { render } from '@testing-library/react'
import { GlobalApp } from './GlobalApp'
import { Provider } from 'react-redux'
import { store } from './store'

const TestingProvider: React.FC = ({ children }) => (
	<Provider store={store}>{children}</Provider>
)

test('Application is rendered correctly', () => {
	const { container } = render(<GlobalApp />, { wrapper: TestingProvider })
	expect(container).toMatchSnapshot()
})

test('Store is correctly initialized', () => {
	render(<GlobalApp />, { wrapper: TestingProvider })
	expect(store.getState()).toEqual({
		_persist: {
			rehydrated: true,
			version: -1,
		},
		cart: [
			{
				amount: 3,
				price: 42,
				productId: 2,
			},
		],
		loading: {
			effects: {
				cart: {},
				players: {},
				settings: {},
				updated: {},
			},
			global: false,
			models: {
				cart: false,
				players: false,
				settings: false,
				updated: false,
			},
		},
		players: {
			players: [],
		},
		settings: {
			isLightThemeOn: true,
		},
		updated: {
			cart: {},
			loading: {},
			players: {},
			settings: {},
		},
	})
})
