import { init } from '@rematch/core'

const count = {
  name: 'count',
  state: 0,
  reducers: {
    addOne: state => state + 1
  }
}

init({
  models: { count }
})

require('./View')