import { Action, Model, PluginCreator } from '@rematch/core'

interface UpdatedConfig {
  name?: string,
}

export default (config: UpdatedConfig = {}): PluginCreator => {
  const updatedModelName = config.name || 'updated'
  const updated = {
    name: updatedModelName,
    reducers: {
      onUpdate: (state, payload) => ({
        ...state,
        [payload.name]: {
          ...state[payload.name],
          [payload.action]: new Date(),
        },
      }),
    },
    state: {},
  }
  return {
    config: {
      models: {
        updated,
      },
    },
    init: ({ dispatch }) => ({
      onModel({ name }: Model) {
        // do not run dispatch on loading, updated models
        const avoidModels = [updatedModelName, 'loading']
        if (avoidModels.includes(name)) { return }

        const modelActions = dispatch[name]

        // add empty object for effects
        updated.state[name] = {}

        // map over effects within models
        Object.keys(modelActions).forEach((action: Action) => {
          if (dispatch[name][action].isEffect) {
            // copy function
            const fn = dispatch[name][action]

            // create function with pre & post loading calls
            const dispatchWithUpdateHook = async (props) => {
              await fn(props)

              // waits for dispatch function to finish before calling "hide"
              dispatch[updatedModelName].onUpdate({ name, action })
            }
            // replace existing effect with new dispatch
            dispatch[name][action] = dispatchWithUpdateHook
          }
        })
      },
    }),
  }
}
