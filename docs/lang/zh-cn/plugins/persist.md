
# Rematch Persist

Rematch  Redux-Persist v5 插件。

使用 local storage 选项提供简单的 redux 状态持久化。

![persist](https://user-images.githubusercontent.com/4660659/33304219-67bd1dc6-d3bc-11e7-8159-a05d65c170bf.gif)


## 安装


```text
npm install @rematch/persist
```

?>  `@rematch/core@0.x` 请使用 `@rematch/persist@0.2.1`

## 设置

```javascript
import createRematchPersist from '@rematch/persist'

const persistPlugin = createRematchPersist({
	whitelist: ['modelName1'],
	throttle: 5000,
	version: 1,
})

init({
	plugins: [persistPlugin],
})
```

## Persist Gate

和 React 一起使用，在等待数据从 storage 中异步加载的同时显示 loading 指示器。

```javascript
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/es/integration/react'

const persistor = getPersistor()

const Root = () => {
	;<PersistGate persistor={persistor}>
		<App />
	</PersistGate>
}
```

## 配置选项

详见 [redux-persist config docs](https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig)
