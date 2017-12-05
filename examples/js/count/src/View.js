import { dispatch } from '@rematch/core'

export default (store) => {
  // select html elements
  const countEl = document.getElementById('count')
  const incrementEl = document.getElementById('increment')

  // add onClick listener
  incrementEl.addEventListener('click', () => dispatch.count.addOne())

  // setup store store subscription
  store.subscribe(() => {
    const state = store.getState()
    countEl.value = state.count
  })
}
