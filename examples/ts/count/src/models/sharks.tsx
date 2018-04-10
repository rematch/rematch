export interface SharkReducers {
    increment: (state: any) => void;
}
export default {
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
