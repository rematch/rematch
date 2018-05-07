import { delay } from '../helpers';

export type DolphinsState = number;

export const dolphins = {
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
};
