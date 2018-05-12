import _selectPlugin, { select as _select } from '@rematch/select';
import { init, ExtractRematchSelectorsFromModels } from '@rematch/core';

import * as models from './models';
export { models };
export type models = typeof models;

export const select = _select as ExtractRematchSelectorsFromModels<models>;
const selectPlugin = _selectPlugin();

export const store = init({
  plugins: [selectPlugin],
  models,
});
