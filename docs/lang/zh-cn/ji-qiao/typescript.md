# TypeScript

### Examples

- Counter

### Changes

Rematch 能与 Typescript 一起工作，使用如下更改：

#### 关闭`noImplicitThis`

Rematch 经常指定`this上下文，导致 TS 错误。`

你可以在你的`tsconfig.json`中指定`noImplicitThis` 关闭这些。

`tsconfig.json`

```javascript
{
  "compilerOptions": {
    "noImplicitThis": false,
  }
}
```

### Dependencies

### 确信 Redux@3.x 没有被依赖。

Rematch 依赖 `Redux@4.x`，它是 Redux 的一个分支，使用泛型处理了许多复杂的类型。

由于 Redux 是 Rematch 的依赖项，因此您可能需要删除\`package.json\`中对 Redux 的引用并重新安装模块。
