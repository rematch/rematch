import { model, init, action } from '../src/index'
import { effect } from '../src/effect'
import { _store } from '../src/store'

beforeEach(() => {
  jest.resetModules()
})

xdescribe('effect:', () => {
  test('should create an action', () => {
    init()

    model({
      name: 'count',
      state: 0,
      effect: {
        add: () => 1,
      },
    })

    expect(typeof action.count.add).toBe('function')
  })

  test('should create an effect', () => {
    init()

    model({
      name: 'example',
      state: 0,
      effect: {
        add: () => 1,
      },
    })

    expect(effect).toEqual({
      add: () => 1,
    })
  })
})
