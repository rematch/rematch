const asyncDelay = (time) => new Promise((resolve) =>
  setTimeout(() => resolve(), time))

// example model
export default {
  state: {},
  effects: {
    async submit() {
      // mocking the delay of an effect
      await asyncDelay(1000)
    },
  }
}
