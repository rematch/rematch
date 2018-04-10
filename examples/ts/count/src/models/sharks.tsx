import { Model } from '@rematch/core';

export interface SharkReducers {
    increment: (state: any) => void;
}
const sharks: Model = {
  state: 0,
  reducers: {
    increment: (state: any, payload: number) => state + payload
  },
  effects: {
    async incrementAsync() {
        this.increment(1);
    }
  }
};

export default sharks;
