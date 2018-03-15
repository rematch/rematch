import { PluginCreator } from '../../typings/rematch'
import DispatchPluginsFactory from './dispatch'
import EffectsPluginsFactory from './effects'

export default class CorePluginsFactory<S> {

  public dispatchPlugin = new DispatchPluginsFactory<S>().dispatchPlugin
  public effectsPlugin = new EffectsPluginsFactory<S>().effectsPlugin

  public readonly corePlugins: Array<PluginCreator<S>> = [
    this.dispatchPlugin,
    this.effectsPlugin,
  ]

}
