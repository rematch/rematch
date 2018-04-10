import { Model } from '@rematch/core';

const dolphins: Model = {
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

export default dolphins;