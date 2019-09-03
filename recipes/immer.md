# Immer

[Immer](https://github.com/mweststrate/immer) provides developer friendly way to create immutable reducers with Rematch.

See an example below:

```javascript
import produce from 'immer';

export default {

  // state is the array of cell IDs for this page
  state: [ '1' ],

  reducers: {

    reorder: produce((state, { fromIndex, toIndex }) => {
      const [ id ] = state.splice(fromIndex, 1);
      if (id) {
        state.splice(toIndex, 0, id);
      }
    }),

    'cells/create': produce((state, { id, atIndex }) => {
      if (atIndex > state.length) {
        throw new Error('Cell index too high');
      }

      state.splice(atIndex, 0, id);
    }),

    'cells/delete': produce((state, { atIndex }) => {
      state.splice(atIndex, 1);
    }),

  },

};
```

If you would like to wrap all reducers with Immer produce, checkout the [Rematch Immer plugin](https://github.com/rematch/rematch/tree/master/plugins/immer).

