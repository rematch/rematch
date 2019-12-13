# Rematch Immer

Rematch 的 immer 插件，使用 immer 提供了 immutable 的能力

## 安装

```text
npm install @rematch/immer
```

?>  `@rematch/core@0.x` 请使用 `@rematch/immer@0.1.0`

## 设置

```javascript
import immerPlugin from '@rematch/immer'
import { init } from '@rematch/core'

const immer = immerPlugin()

init({
	plugins: [immer],
})
```

### 用法

使用 Immer 插件，reducer 可以使用 mutable 方法来实现不可变状态。 例如：

```javascript
const todo = {
	state: [
		{
			todo: 'Learn typescript',
			done: true,
		},
		{
			todo: 'Try immer',
			done: false,
		},
	],
	reducers: {
		done(state) {
			state.push({ todo: 'Tweet about it' })
			state[1].done = true
			return state
		},
	},
}
```

在 Immer 中，reducer 执行突变以实现下一个不可变状态。 请记住，Immer 只支持对普通对象和数组的变化检测，所以像字符串或数字这样的原始值总是会返回一个变化。 例如：

```javascript
const count = {
	state: 0,
	reducers: {
		add(state) {
			state += 1
			return state
		},
	},
}
```

我向开发者减一， reducrs 可以始终返回改变后的 state。
