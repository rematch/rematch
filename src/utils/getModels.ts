import { Model, Models } from '../../typings/rematch'

export default <S>(models: Models<S>): Array<Model<S>> => {
  return Object.keys(models).map((name: string) => ({
    name,
    ...models[name],
  }))
}
