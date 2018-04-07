export default {
    state: 0,
    reducers: {
        increment: (state: any) => state + 1
    },
    effects: {
        async incrementAsync() {
            this.increment();
        }
    }
};
