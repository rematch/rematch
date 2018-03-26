const delay = ms => new Promise(r => setTimeout(r, ms))
exports.delay = delay

exports.count = {
  state: 0,
  reducers: {
    addOne: s => s + 1
  },
  effects: {
    async timeout() {
      await delay(200)
      this.addOne()
    }
  }
}

