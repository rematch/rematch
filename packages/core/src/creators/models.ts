import * as R from '../typings'

export default (models: R.Models): R.NamedModel[] => {
  return Object.keys(models).map((name: string) => ({
    name,
    ...models[name],
    reducers: models[name].reducers || {},
  }))
}
