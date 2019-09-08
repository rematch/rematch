---
description: 当前 Rematch 依赖 Redux-Persist v5 版本插件。
---

# Rematch Persist

使用 local  storage 选项提供简单的 redux 状态持久化。

![](../../../_media/icon.svg)

### 安装

```bash
npm install @rematch/persist
```

?> 针对   `@rematch/core@0.x` 使用  `@rematch/persist@0.2.1`

### 设置

```javascript
import createRematchPersist from '@rematch/persist'

const persistPlugin = createRematchPersist({
  whitelist: ['modelName1'],
  throttle: 5000,
  version: 1,
})

init({
  plugins: [persistPlugin]
})
```

### Persist Gate

和React一起使用，在等待数据从 storage 中异步加载的同时显示 loading 指示器。

```javascript
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/es/integration/react'

const persistor = getPersistor()

const Root = () => {
  <PersistGate persistor={persistor}>
    <App />
  </PersistGate>
}
```

### 配置选项

参看  [redux-persist config docs](https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig)

