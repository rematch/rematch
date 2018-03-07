# Vue

You can use rematch with Vue the same way you have been using it with Vue, Redux and [vuejs-redux](https://github.com/titouancreach/vuejs-redux).
Instead of high order component, we create a container component that is responsible to connect the child component.

See an example below:

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

<script>
  import Provider from 'vuejs-redux';
  import { init } from '@rematch/core';
  import Counter from './Counter.vue';

  // Every provider components need the store. To connect the components to the same instance of
  // the store, it's recommanded to export the instance of the store in another file and import it
  // in the container components.
  const store = init();

  // It's recommanded to declare mapState and mapDispatch outside the component (as pure function)
  // for easier tests.
  const mapState = state => ({
    count: state.count,
  });

  const mapDispatch = dispatch => ({
    increment: () => dispatch.count.increment(),
  })

  export default {
    data: () => ({
      store // make it accessible in the template
    }),

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
