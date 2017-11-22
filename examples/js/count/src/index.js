import { init } from '@rematch/core'

const count = {
  state: 0,
  reducers: {
    addOne: state => state + 1
  }
}

init({
  models: { count }
})

require('./View')