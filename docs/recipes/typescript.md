# TypeScript

### Examples

- [Counter](../../examples/ts/count)

### Changes

Rematch can work with TypeScript with the following changes:

##### Autocomplete Dispatch/Models

To ensure autocomplete works, with TS wrap models with `createModel`. See example below:

```ts
import { createModel } from '@rematch/core';

import { delay } from '../helpers';

export type SharksState = number;

export const sharks = createModel({
  state: 0,
  reducers: {
    increment: (state: SharksState, payload: number): SharksState => state + payload,
  },
  effects: {
    // TODO: Optional args breaks TypeScript autocomplete (e.g. payload: number = 1)
    async incrementAsync(payload: number) {
      await delay(500);
      this.increment(payload || 1);
    },
  },
  selectors: {
    total(state: SharksState) {
      return state;
    }
  }
});
```

##### Select Plugin

To enable autocomplete of select, use `getSelect` with the select plugin. See example below:

```ts
import selectPlugin, { getSelect } from '@rematch/select';
import { init } from '@rematch/core';

import * as models from './models';

export { models };
export type models = typeof models;

export const select = getSelect<models>();

export const store = init({
  plugins: [selectPlugin()],
  models,
});
```

### Dependencies

##### Ensure `Redux@3.x` is not a dependency. 

Rematch relies on `Redux@4.x`, a branch of Redux with cleaned up a lot of complex typings relying on generics.

As Redux is a dependency of Rematch, you may just need to remove any references to Redux in your `package.json` and reinstall modules.