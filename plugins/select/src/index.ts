import { Model, PluginCreator } from '@rematch/core'

export const select = {}

interface selectConfig {
  sliceState?: any,
}

const selectPlugin = ({
  sliceState = (rootState, model) => rootState[model.name],
}: selectConfig = {}): PluginCreator => ({
  expose: { select },
  init: ({ validate }) => {
    validate([
      [
        typeof sliceState !== 'function',
        `The selectPlugin's getState config must be a function. Instead got type ${typeof sliceState}.`,
      ]
    ]);

    return {
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
            model.selectors[selectorName](
              sliceState(state, model),
              ...args
            )
        })
      },
    }
  },
})

export default selectPlugin
