import { dispatch } from '@rematch/core'

export const countA = {
  name: 'countA',
  state: 0,
  reducers: {
    increment: s => s + 1
  },
  effects: {
    asyncIncrement: async (payload, getState) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      dispatch.countA.increment()
    }
  },
  selectors: {
    double: s => s * 2
  },
  subscriptions: {
    'countB/increment': () => {
      dispatch.countA.increment()
    }
  }
}

export const countB = {
  name: 'countB',
  state: 0,
  reducers: {
    increment: s => s + 1
  },
}
