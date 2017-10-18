declare type $plugin = {
  onInit(): any,
  onModel(model: $model, exports: any, dispatch: any): void,
  middleware: $middleware,
}
