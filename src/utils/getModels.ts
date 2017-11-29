import { Config, Model, Models, Plugin } from '../typings/rematch'

export default (models: Models): Model[] => {
  return Object.keys(models).map((name: string) => ({
    name,
    ...models[name],
  }))
}
