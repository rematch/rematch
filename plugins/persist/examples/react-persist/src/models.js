export const count = {
  state: { total: 0 },
  reducers: {
    addOne: s => ({
      total: s.total + 1,
    })
  }
}

export const nonpersistedCount = {
  state: { total: 0 },
  reducers: {
    addOne: s => ({
      total: s.total + 1,
    })
  },
}
