# Inspiration

Rematch refines and builds upon the ideas of [Dva](https://github.com/dvajs/dva) & [Mirror](https://github.com/mirrorjs/mirror).

|                   | Rematch                | Mirror            | Dva               |
| :---------------- | :--------------------- | :---------------- | :---------------- |
| framework         | any, none              | React             | React             |
| router            | any, none              | RR4               | RR3, RR4, none    |
| mobile ready      | ‎✔                     | ✘                 | ‎✔                |
| devtools          | Redux, Reactotron      | Redux             | Redux             |
| plugins           | ✔                      | ✔                 | ✔                 |
| reducers          | ✔                      | ✔                 | ✔                 |
| effects           | async/await            | async/await       | redux saga        |
| effect params     | \(payload, internals\) | \(action, state\) | \(action, state\) |
| listeners         | subscriptions          | hooks             | subscriptions     |
| lazy load models  | ✔                      | ✔                 | ✔                 |
| chained dispatch  | ✔                      | ✔                 | ✔                 |
| direct dispatch   | ✔                      |                   |                   |
| dispatch promises | ✔                      |                   | ✔                 |
| loading plugin    | ✔                      | ✔                 | ✔                 |
| persist plugin    | ✔                      |                   |                   |

## Easier to Migrate From Redux

Migrating from Redux to Rematch may only involve minor changes to your state management, and no necessary changes to your view logic. You can continue to use your current reducers, passed in to `init` as `extraReducers`. You can also use `dispatch(action)` directly to trigger actions.

## Composable Plugins

Rematch and its internals are all built upon a plugin pipeline. Everything from dispatch to selectors is a plugin. As a result, developers can make complex custom plugins that modify the setup or add to the `model`, often without requiring any changes to Rematch itself.
