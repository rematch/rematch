# Updated

Rematch plugin for keeping a store's name in state for future lookup.

This is primarily used for other plugins.


### Install

```
npm install @rematch/exposeStoreName
```

### Setup

```js
import exposeStoreName from '@rematch/updated'

const expose = exposeStoreName()

return {
  config: {
    plugins: [expose]
  },
  onModel(...) {
    ...
  },
  ...
})
```
