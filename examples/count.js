import { init } from '@rematch/core'

const count = {
	state: 0,
	reducers: {
		addOne: (state) => state + 1,
	},
}

const store = init({
	models: { count },
})

export default (countHtmlElement, incrementHtmlElement) => {
	// add onClick listener
	incrementHtmlElement.addEventListener('click', () =>
		store.dispatch.count.addOne()
	)

	// setup store store subscription
	store.subscribe(() => {
		const state = store.getState()
		countHtmlElement.value = state.count
	})
}
