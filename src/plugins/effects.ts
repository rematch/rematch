import { Dispatch, MiddlewareAPI, Store } from 'redux'
import { Action, Exposed, Model, Plugin, PluginCreator } from '../../typings/rematch'

const effectsPlugin: PluginCreator = {
  expose: {
    effects: {},
  },
  init: ({ effects, dispatch, createDispatcher, validate }: Exposed): Plugin => ({
    onModel(model: Model): void {
      Object.keys(model.effects || {}).forEach((effectName: string) => {
        if (process.env.NODE_ENV !== 'production') {
          validate([
            [
              !!effectName.match(/\/.+\//),
              `Invalid effect name (${model.name}/${effectName})`,
            ],
            [
              typeof model.effects[effectName] !== 'function',
              `Invalid effect (${model.name}/${effectName}). Must be a function`,
            ],
          ])
        }

        // the effect we're interested in
        // if this isn't the root effect then this is in the form `model/effect`
        let targetEffectName = effectName
        let isRoot = false;

        // this is the root effect!
        if (!effectName.includes('/')) {
          targetEffectName = `${model.name}/${effectName}`;
          isRoot = true
        }

        // always bind the effect to the model it's on
        const effect = model.effects[effectName].bind(dispatch[model.name]);

        // this is a new effect, intiialize it
        if (!effects[targetEffectName]) {
          effects[targetEffectName] = {
            rootEffect: null,
            listeningEffects: [],        
          }
        }

        // update the root effect if this is the root, otherwise add it to the listener list
        if (isRoot) {
          effects[targetEffectName].rootEffect = effect
        } else {
          effects[targetEffectName].listeningEffects.push(effect)
        }

        // don't try and re-create the dispatcher if we're nt the root effect or it already exists
        if (!isRoot || (dispatch[model.name][effectName] && dispatch[model.name][effectName].isEffect)) {
          return
        }

        // add effect to dispatch
        // is assuming dispatch is available already... that the dispatch plugin is in there
        dispatch[model.name][effectName] = createDispatcher(model.name, effectName)

        // tag effects so they can be differentiated from normal actions
        dispatch[model.name][effectName].isEffect = true
      })
    },
    middleware: <S>(store: MiddlewareAPI<S>) => (next: Dispatch<S>) => async (action: Action) => {
      if (action.type in effects) {
        const state = store.getState()
        let result = null

        // wait for the root effect if it's defined
        if (effects[action.type].rootEffect) {
          result = await effects[action.type].rootEffect(action.payload, state, action.meta)
        }

        // run the listening effects in parallel
        await Promise.all(effects[action.type].listeningEffects.map(effect => effect(action.payload, state, action.meta)))
      }

      return await next(action)
    },
  }),
}

export default effectsPlugin
