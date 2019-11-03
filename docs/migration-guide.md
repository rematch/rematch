# Migration Guide

### Migrating From Redux <a id="migrating-from-redux"></a>

Moving from Redux to Rematch involves very few steps.

1. Setup Rematch `init` with Redux [step 1](https://codesandbox.io/s/yw2wy1q929)
2. Mix reducers & models [step 2](https://codesandbox.io/s/9yk6rjok1r)
3. Shift to models [step 3](https://codesandbox.io/s/mym2x8m7v9)

### Migration from 0.x to 1.x <a id="migration-from-0x-to-1x"></a>

For an earlier version, see [v0.x docs](https://github.com/rematch/rematch/tree/v0). Currently only displaying v1.x documentation.

Breaking changes with v1.0.0. Global imports of `dispatch` and `getState` have been removed. Instead, you can export and import your store, capturing `store.dispatch`, `store.getState`. See the [Changelog](https://github.com/rematch/rematch/blob/master/CHANGELOG.md) for details.
