import { createModel, init } from '@rematch/core'
import createView from './View'

const count = createModel({
  state: 0,
  reducers: {
    addOne: state => state + 1
  }
})

const store = init({
  models: { count }
})

createView(store)
