import { Config, Model, Plugin } from '../typings/rematch'

export default (models): Model[] => {
  return Object.keys(models).map((name: string) => ({
    name,
    ...models[name],
  }))
}
