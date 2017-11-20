import { dispatch } from '@rematch/core'

export const count = {
  name: 'count',
  state: 0,
  reducers: {
    increment: s => s + 1
  },
  effects: {
    asyncIncrement: async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      dispatch.count.increment()
    }
  },
}
