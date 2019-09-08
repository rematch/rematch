---
description: 给 Rematch 使用的 Immer 插件。在 immer 库上提供不可变能力。
---

# Rematch Immer

### 安装

```bash
npm install @rematch/immer
```

?> 针对 `@rematch/core@0.x` 使用 `@rematch/immer@0.1.0`

### 设置

```javascript
import immerPlugin from '@rematch/immer'
import { init } from '@rematch/core'

const immer = immerPlugin()

init({
  plugins: [immer]
})
```

### 用法

使用Immer插件，reducer可以使用mutable方法来实现不可变状态。 例如：

```javascript
const todo = {
  state: [{
    todo: "Learn typescript",
    done: true
  }, {
    todo: "Try immer",
    done: false
  }],
  reducers: {
    done(state) {
      state.push({todo: "Tweet about it"})
      state[1].done = true
      return state
    }
  }
};
```

在 Immer 中，reducer 执行突变以实现下一个不可变状态。 请记住，Immer 只支持对普通对象和数组的变化检测，所以像字符串或数字这样的原始值总是会返回一个变化。 例如：

```javascript
const count = {
  state: 0,
  reducers: {
    add(state) {
      state += 1
      return state
    }
  }
};
```

我向开发人员建议，reducer 可以随时返回变值。





