const T = require('prop-types')
const typingsPlugin = require('../src').default
const { init } = require('../../../src')

const model = {
  state: {
    name: 'Jon',
    age: 25,
  },
  reducers: {
    update: (state, { name, age }) => ({
      name,
      age,
    }),
  },
}

const typings = {
  name: T.string.isRequired,
  age: T.number.isRequired,
}

describe('typings:', () => {
  test('triggers one warning when one type is invalid', () => { 
    global.console = {
      warn: jest.fn(),
    }

    const user = {
      ...model,
      typings,
    }

    const store = init({
      models: { user },
      plugins: [typingsPlugin()]
    })

    store.dispatch.user.update({ name: undefined, age: 26 })
    expect(global.console.warn).toHaveBeenCalledTimes(1)
  })

  test('triggers two warnings when two types are invalid', () => { 
    global.console = {
      warn: jest.fn(),
    }

    const user = {
      ...model,
      typings,
    }

    const store = init({
      models: { user },
      plugins: [typingsPlugin()]
    })

    store.dispatch.user.update({ name: undefined, age: '26' })
    expect(global.console.warn).toHaveBeenCalledTimes(2)
  })

  test('does not trigger warning on valid type', () => { 
    global.console = {
      warn: jest.fn(),
    }

    const user = {
      ...model,
      typings,
    }

    const store = init({
      models: { user },
      plugins: [typingsPlugin()]
    })


    store.dispatch.user.update({ name: 'Jane', age: 23 })
    expect(global.console.warn).toHaveBeenCalledTimes(0)
  })

  test('triggers warning when typings config is missing', () => { 
    global.console = {
      warn: jest.fn(),
    }

    const user = {
      ...model,
    }

    const store = init({
      models: { user },
      plugins: [typingsPlugin()]
    })

    store.dispatch.user.update({ name: 'Jane', age: 23 })
    expect(global.console.warn).toHaveBeenCalledTimes(1)
  })
})
