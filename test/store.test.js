// Test for global exported store object
import { init, model } from '../src/index'
import { store } from '../src/init'


beforeEach(() => {
  jest.resetModules()
})

describe('init', () => {
  it('should create a redux store', () => {
    init()

    expect(store.getState()).toEqual({})
  })
})

// describe('xxx', () => {
//   it('yyy', () => {
//     init()
//
//     model({
//       name: 'count',
//       state: 99,
//     })
//
//     expect(store.getState()).toEqual({ count: 99 })
//   })
// })
