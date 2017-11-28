# Rematch Loading

Adds automated loading indicators for effects to [Rematch](https://github.com/rematch/rematch). Inspired by [dva-loading](https://github.com/dvajs/dva-loading).

## Example

See an example below using a loading indicator within a button.

```js
import React from 'react'
import { dispatch } from '@rematch/core'
import AwesomeLoadingButton from './components/KindaCoolLoadingButton'

const LoginButton = (props) => (
  <AwesomeLoadingButton onClick={props.submit} loading={props.loading}>
    Login
  </AwesomeLoadingButton>
)

const mapToProps = state => ({
  submit: () => dispatch.login.submit(),
  loading: state.loading.models.login,
  submitting: state.loading.effects.login.submit,
})

export default connect(mapState)(App)
```

In the above case:

- 'loading' is triggered whenever any effect on the `login` model is running
- 'submitting' is triggered while `login.submit` is running

## Demo

See a [demo](./examples/react-loading-example)

![rematch-loading](https://user-images.githubusercontent.com/4660659/33303781-00c786b2-d3ba-11e7-8216-1b2b8eebbf85.gif)

## Setup

Install `@rematch/loading` as a dependency.

```shell
npm install @rematch/loading
```

Configure loading.

```js
import { init } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'

// see options API below
const options = {}

const loading = createLoadingPlugin(options)

init({
  plugins: [loading]
})
```

## Options

### name

The loading reducer defaults to the name of "loading".

If you would like to change this, use the `name` option.

```js
const loading = createLoadingPlugin({ name: 'load' })
```

In which case, loading can be accessed from `state.load.global`.