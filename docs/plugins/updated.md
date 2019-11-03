# Updated

Rematch plugin for maintaining timestamps when an effect is triggered.

Updated is primarily used for optimizing effects. It can be used to:

- prevent expensive fetch requests within a certain time period
- throttle effects

## Install

```text
npm install @rematch/updated
```

?> For `@rematch/core@0.x` use `@rematch/updated@0.1.5`

## Setup

```javascript
import updatedPlugin from '@rematch/updated'

const updated = updatedPlugin()

init({
	models,
	plugins: [updated],
})
```
