# Typings

Rematch plugin for validating state object against provided typings. Every time state changes, it will be checked against specified `typings` schema. If there are any mismatches, warnings will be logged into console.


## Example

```js
import T from 'prop-types'

const typings = {
	firstName: T.string,
	email: T.string.isRequired,
	age: T.number,
	address: T.shape({
		city: T.string.isRequired,
		street: T.string,
	}).isRequired
}

const values = {

}
```
