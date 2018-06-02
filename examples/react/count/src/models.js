export const count = {
  state: 0,
  reducers: {
    increment: s => s + 1
  },
  effects: {
    async asyncIncrement() {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      this.increment()
    }
  },
}
