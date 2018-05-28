import index from './dist';
import { ExtractRematchSelectorsFromModels, Models } from '../../typings/rematch/index'

export const select = {}

export function getSelect<M extends Models = Models>() {
  return select as ExtractRematchSelectorsFromModels<M>
}

export * from './dist';
export default index;
