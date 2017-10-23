declare type $plugin = {
  onInit?: (dispatch: any) => void,
  onModel?: (model: $model, dispatch: any) => void,
  model?: $model,
  middleware?: $middleware,
}
