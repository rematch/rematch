declare type $plugin = {
  onInit?: () => void,
  onModel?: (model: $model, dispatch: any) => void,
  model?: $model,
  middleware?: $middleware,
}
