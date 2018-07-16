const T = require('prop-types')
const typingsPlugin = require('../src').default
const { init } = require('../../../src')

const user = {
  state: {
    name: 'Jon',
    age: 25,
  },
  typings: {
    name: T.string.isRequired,
    age: T.number.isRequired,
  },
  reducers: {
    updateName: (state, { name }) => ({
      ...state,
      name,
    }),
  },
}

describe('typings:', () => {
  test('should work with an object state', () => { 

    const store = init({
      models: { user },
      plugins: [typingsPlugin()]
    })

    store.dispatch.user.updateName({ name: undefined })
  })
})
