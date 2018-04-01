import { Model, Plugin } from '@rematch/core'

interface selectConfig {
  sliceState?: any,
}

const selectPlugin = ({
  sliceState = (rootState, model) => rootState[model.name],
}: selectConfig = {}): Plugin => ({
  exposed: {
    select: {},
  },
  onInit() {
    this.validate([
      [
         typeof sliceState !== 'function',
         `The selectPlugin's getState config must be a function. Instead got type ${typeof sliceState}.`,
       ],
     ])
  },
  onModel(model: Model) {
    this.select[model.name] = {}

    Object.keys(model.selectors || {}).forEach((selectorName: string) => {
      this.validate([
        [
          typeof model.selectors[selectorName] !== 'function',
          `Selector (${model.name}/${selectorName}) must be a function`,
        ],
      ])
      this.select[model.name][selectorName] = (state: any, ...args) =>
        model.selectors[selectorName](
          sliceState(state, model),
          ...args,
        )
    })
  },
})

export default selectPlugin
