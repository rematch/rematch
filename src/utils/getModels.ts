import { Config, Plugin } from '../typings'

const captureModels = (models = {}) => Object.keys(models).map((name: string) => ({
  name,
  ...models[name],
}))

export default (config: Config) => [
  ...captureModels(config.models),
]
