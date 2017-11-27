import { Model, PluginCreator } from '@rematch/core'

export const select = {}

const selectPlugin = (): PluginCreator => ({
  expose: { select },
  init: ({ validate }) => ({
    onModel(model: Model) {
      select[model.name] = {}
      Object.keys(model.selectors || {}).forEach((selectorName: string) => {
        validate([
          [
            typeof model.selectors[selectorName] !== 'function',
            `Selector (${model.name}/${selectorName}) must be a function`,
          ],
        ])
        select[model.name][selectorName] = (state: any, ...args) =>
          model.selectors[selectorName](state[model.name], ...args)
      })
    },
  }),
})

export default selectPlugin
