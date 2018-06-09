import index from './dist';
import { ExtractRematchSelectorsFromModels, Models } from '../../src/typings'

// @ts-ignore
export const select = {}

// @ts-ignore
export function getSelect<M extends Models = Models>() {
  return select as ExtractRematchSelectorsFromModels<M>
}

export * from './dist';
export default index;
