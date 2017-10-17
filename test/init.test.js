// Tests for consumer API
import { model, init, getStore } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('init:', () => {
  test('no params should create store with state `{}`', () => {
    init()

    expect(getStore().getState()).toEqual({})
  })
  
  test('init() & one model of state type `string`', () => {
    init()

    model({
      name: 'app',
      state: 'Hello, world',
    })

    expect(getStore().getState()).toEqual({
      app: 'Hello, world',
    })
  })

  test('init() & one model of state type `number`', () => {
    init()

    model({
      name: 'count',
      state: 99,
    })

    expect(getStore().getState()).toEqual({
      count: 99,
    })
  })

  test('init() & one model of state is 0', () => {
    init()

    model({
      name: 'count',
      state: 0,
    })

    expect(getStore().getState()).toEqual({
      count: 0,
    })
  })

  test('init() & one model of state type `object`', () => {
    init()

    model({
      name: 'todos',
      state: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })

    expect(getStore().getState()).toEqual({
      todos: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })
  })
  test('init() & two models', () => {
    init()

    model({
      name: 'app',
      state: 'Hello, world',
    })

    model({
      name: 'count',
      state: 99,
    })

    expect(getStore().getState()).toEqual({
      app: 'Hello, world',
      count: 99,
    })
  })

  test('init() & three models', () => {
    init()

    model({
      name: 'app',
      state: 'Hello, world',
    })

    model({
      name: 'count',
      state: 99,
    })

    model({
      name: 'todos',
      state: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })

    expect(getStore().getState()).toEqual({
      app: 'Hello, world',
      count: 99,
      todos: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })
  })
})
