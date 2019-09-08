# Rematch Updated

Rematch 插件用于在触发 effects 时维护时间戳。

Updated主要用于优化 throttle 。 它可以用来：

* 在一定的时间段内防止昂贵（频繁）的获取请求。
* throttle effects 

### 安装

```bash
npm install @rematch/updated
```

?> 针对 `@rematch/core@0.x` 使用 `@rematch/updated@0.1.5`
### 设置

```javascript
import updatedPlugin from '@rematch/updated'

const updated = updatedPlugin()

init({
  models,
  plugins: [updated],
})
```











