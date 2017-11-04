
const asyncDelay = (time) => new Promise((resolve) =>
  setTimeout(() => resolve(), time))

export default {
  name: 'form',
  state: {},
  effects: {
    async submit() {
      // mocking the delay of a form submit
      await asyncDelay(1000)
    },
  }
}
