import index from './dist';
import { ExtractRematchSelectorsFromModels, Models } from '../../typings/rematch/index'

// @ts-ignore
export const select = {}

// @ts-ignore
export function getSelect<M extends Models = Models>() {
  return select as ExtractRematchSelectorsFromModels<M>
}

export * from './dist';
export default index;
