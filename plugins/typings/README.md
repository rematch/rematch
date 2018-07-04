# Typings

Rematch plugin for validating state object against provided typings. Every time state changes, it will be checked against specified `typings` schema. If there are any mismatches, warnings will be logged into console.


## Example

```js
const config = {
  state: {
    name: 'Konstantin',
    age: 28,
    height: undefined,
    isDeveloper: true,
    birthDate: new Date(1990, 3, 22),
    address: {
      country: 'Czech Republic',
      city: 'Prague',
      street: undefined,
    }
  },
  typings: {
    name: 'string',
    age: 'number',
    height: 'number?',
    isDeveloper: 'boolean',
    birthDate: 'date',
    address: {
      country: 'string?',
      city: 'string',
      street: 'string?',
    }
  }
}
```

## Supported types

|Types      |Examples                                                   |
|-----------|-----------------------------------------------------------|
|Primitive  |`string`, `number`, `boolean`, `date`, `undefined`, `null` |
|Optional   |`string?`, `number`, ...                                   |                  
|Union      |`string|number`, `number?|date|string`                     |