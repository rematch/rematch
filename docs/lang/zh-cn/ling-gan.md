# 灵感

创造 Rematch 的灵感来源于 [Dva](https://github.com/dvajs/dva/) 和 [Mirror](https://github.com/mirrorjs/mirror) .

|                   | Rematch                | Mirror            | Dva                   |
| ----------------- | ---------------------- | ----------------- | --------------------- |
| 适用框架          | 所有框架 / 不使用框架  | React             | React                 |
| 适用路由          | 所有路由 / 不使用路由  | RR4               | RR3, RR4 / 不使用路由 |
| 移动端            | √                      | ×                 | √                     |
| 开发者工具        | Redux, Reactotron      | Redux             | Redux                 |
| 插件化            | √                      | √                 | √                     |
| reducers          | √                      | √                 | √                     |
| effects           | async/await            | async/await       | redux saga            |
| effect params     | \(payload, internals\) | \(action, state\) | \(action, state\)     |
| 监听方式          | subscriptions          | hooks             | subscriptions         |
| 懒加载模型        | √                      | √                 | √                     |
| 链式 dispatch     | √                      | √                 | √                     |
| 直接 dispatch     | √                      |                   |                       |
| dispatch promises | √                      |                   | √                     |
| 加载插件          | √                      | √                 | √                     |
| persist plugin    | √                      |                   |                       |

### 从 Redux 轻松迁移

从 Redux 迁移到 Rematch 只会在状态管理上有微小的改变，不会影响到你的视图逻辑。你可以通过将现有的 reducers 当作 `extraReducers` 传入 `init` 继续使用你当前的 reducers，你也可以使用 `dispatch(action)`直接触发 actions。

### 可组合的插件

Rematch 从里到外都是构造于插件机制之上。无论是 dispatch 还是 selectors 统统都是插件。因此，开发者可以创造一个复杂的自定义插件，在 `modal` 上修改 setup 或者 add ，而无需对 Rematch 本身做任何修改。
