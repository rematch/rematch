# Vue

你可以在 Vue 里使用 rematch，就像在 Vue 上使用 Redux 和 [vuejs-redux](https://github.com/titouancreach/vuejs-redux). 在 Vue 中使用 rematch，与在 React 中使用 connect 高阶组件不同，我们创造了一个容器组件，用来负责连接子组件。

看下面的例子：

CounterContainer.vue

```vue
<template>
  <Provider
    :store="store"
    :mapDispatch="mapDispatch"
    :mapState="mapState">
    <template slot-scope="{ count, increment }">
      <Counter :count="count" :increment="increment"/>
    </template>
  </Provider>
</template>
​
<script>
  import Provider from 'vuejs-redux';
  import { init } from '@rematch/core';
  import Counter from './Counter.vue';
​
  // Every provider components need the store. To connect the components to the same instance of
  // the store, it's recommended to export the instance of the store in another file and import it
  // in the container components.
  const store = init();
​
  // It's recommended to declare mapState and mapDispatch outside the component (as pure function)
  // for easier tests.
  const mapState = state => ({
    count: state.count,
  });
​
  const mapDispatch = dispatch => ({
    increment: () => dispatch.count.increment(),
  })
​
  export default {
    data: () => ({
      store // make it accessible in the template
    }),
​
    methods: {
      mapDispatch,
      mapState
    }
  }
</script>
```

Counter.vue

```vue
<template>
  <div>
    <h2>Count: {{ count }}</h2>
    <button @click="increment" />
  </div>
</template>

<script>
export default {
  props: ['count', 'increment']
};
</script>
```
