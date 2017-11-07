import { dispatch } from '@rematch/core'

export const count = {
  name: 'count',
  state: { total: 0 },
  reducers: {
    addOne: s => ({
      total: s.total + 1,
    })
  }
}

export const unpersistedCount = {
  name: 'nonpersistedCount',
  state: { total: 0 },
  reducers: {
    addOne: s => ({
      total: s.total + 1,
    })
  },
  subscriptions: {
    'count/addOne': () => dispatch.nonpersistedCount.addOne(),
  }
}
