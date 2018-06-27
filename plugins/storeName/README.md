# Updated

Rematch plugin for keeping a store's name in state for future lookup.

Other plugins use this to know where to look for a reference.


### Install

```
npm install @rematch/exposeStoreName
```

### Setup

```js
import storeNamePlugin from '@rematch/storeName'

{
  ...
  plugins: [ ..., storeNamePlugin()],
  ...
}
```

You can also choose to use a different state key:
```js
storeNamePlugin({ name: 'whatever' })
```
