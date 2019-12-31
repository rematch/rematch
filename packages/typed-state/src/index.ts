/* eslint-disable no-console */
import { NamedModel, Plugin } from '@rematch/core'
import validate from './validate'

const cachedTypings = {}

const typedStatePlugin = (): Plugin => ({
  exposed: {
    typings: {},
  },
  onModel(model: NamedModel): void {
    cachedTypings[model.name] = model.typings
  },
  createMiddleware: () => store => next => action => {
    const called = next(action)
    const [modelName] = action.type.split('/')
    const typings = cachedTypings[modelName]
    if (typings) {
      validate(typings, store.getState()[modelName], modelName)
    } else {
      console.warn(
        `[rematch]: Missing typings definitions for \`${modelName}\` model`
      )
    }
    return called
  },
})

export default typedStatePlugin
