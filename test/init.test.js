beforeEach(() => {
  jest.resetModules()
})

describe('init:', () => {
  test('no params should create store with state `{}`', () => {
    const { init, getStore } = require('../src')
    init()

    expect(getStore().getState()).toEqual({})
  })

  test('should create models', () => {
    const { init, getStore } = require('../src')

    init({
      models: {
        app: {
          name: 'app',
          state: 'Hello, model 1',
        },
        app2: {
          name: 'app2',
          state: 'Hello, model 2',
        },
      }
    })

    expect(getStore().getState()).toEqual({
      app: 'Hello, model 1',
      app2: 'Hello, model 2'
    })
  })

  test('should allow both init models & model models', () => {
    const { init, model, getStore } = require('../src')

    init({
      models: {
        app: {
          name: 'app',
          state: 'Hello, model 1',
        },
      }
    })

    model({
      name: 'app2',
      state: 'Hello, model 2',
    })

    expect(getStore().getState()).toEqual({
      app: 'Hello, model 1',
      app2: 'Hello, model 2'
    })
  })

  test('should throw if models are not an object', () => {
    const { init } = require('../src')

    const model = {
      name: 'app',
      state: 'Hello, world',
    }

    expect(() => init({
      models: [model]
    })).toThrow()
  })

  test('init() & one model of state type `string`', () => {
    const { model, init, getStore } = require('../src')
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
    const { model, init, getStore } = require('../src')
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
    const { model, init, getStore } = require('../src')
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
    const { model, init, getStore } = require('../src')
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
    const { model, init, getStore } = require('../src')
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
    const { model, init, getStore } = require('../src')
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
