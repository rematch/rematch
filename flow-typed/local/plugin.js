declare type $plugin = {
  onStoreCreated?: () => void,
  onModel?: (model: $model, dispatch: any) => void,
  model?: $model,
  middleware?: $middleware,
}

declare type $pluginCreator = {
  expose: Object,
  config: Object,
  init: (exposed: Object) => $plugin
}
