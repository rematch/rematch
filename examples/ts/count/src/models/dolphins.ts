import { createModel } from '@rematch/core';

import { delay } from '../helpers';

export type DolphinsState = number;

export const dolphins = createModel({
   state: 0,
   reducers: {
      increment: (state: DolphinsState) => state + 1,
   },
   effects: {
      async incrementAsync() {
         await delay(500);
         this.increment();
      },
   },
});
