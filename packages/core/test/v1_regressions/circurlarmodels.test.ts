import { init } from '../../src'

it('circular models should destruct properly', async () => {
	type CountState = number
	const dolphins = {
		state: 0,
		reducers: {
			increment: (state: CountState) => state + 1,
		},
		effects: ({ sharks, dolphins }: any) => {
			return {
				async incrementAsync(): Promise<void> {
					dolphins.increment()
				},
				async incrementSharksAsync(): Promise<void> {
					sharks.incrementAsync(1)
				},
			}
		},
	}
	const sharks = {
		state: 0,
		reducers: {
			increment: (state: CountState, payload: number) => state + payload,
		},
		effects: ({ dolphins, sharks }: any) => ({
			async incrementAsync(payload: number): Promise<void> {
				dolphins.increment()
				sharks.increment(payload)
			},
		}),
	}

	const store = init({
		models: { dolphins, sharks },
	})

	// store.dispatch({ type: 'count/addCount' })
	await store.dispatch.sharks.incrementAsync(4)
	expect(store.getState().sharks).toEqual(4)

	await store.dispatch.dolphins.increment()
	await store.dispatch.dolphins.incrementSharksAsync()
	expect(store.getState().dolphins).toEqual(3)
})
