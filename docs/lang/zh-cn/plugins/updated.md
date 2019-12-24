# Rematch Updated

Rematch 插件用于在触发 effects 时维护时间戳。

Updated 主要用于优化 throttle 。 它可以用来：

- 在一定的时间段内防止昂贵（频繁）的获取请求。
- 节流 effects

## 安装

```text
npm install @rematch/updated
```

?>  `@rematch/core@0.x` 请使用 `@rematch/updated@0.1.5`

## 设置


```javascript
import updatedPlugin from '@rematch/updated'

const updated = updatedPlugin()

init({
	models,
	plugins: [updated],
})
```
