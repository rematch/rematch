import _selectPlugin, { select as _select } from '@rematch/select';
import { init, ExtractRematchSelectorsFromModels } from '@rematch/core';

import * as models from './models';
export { models };

export const select = _select as ExtractRematchSelectorsFromModels<typeof models>;
const selectPlugin = _selectPlugin();

export const store = init({
  plugins: [selectPlugin],
  models,
});
