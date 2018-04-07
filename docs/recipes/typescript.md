# TypeScript

Rematch can work with TypeScript with the following changes:

##### Turn off "noImplicitThis".

Rematch often specifies the context of `this`, leading to TS errors. 

You can turn these off by specifying `noImplicitThis` as false in your "tsconfig.json".

// tsconfig.json

```json
{
  "compilerOptions": {
    "noImplicitThis": false,
  }
}
```

##### Ensure `Redux@3.x` is not a dependency. 

Rematch relies on `Redux@4.x`, a branch of Redux with cleaned up a lot of complex typings relying on generics.

As Redux is a dependency of Rematch, you may just need to remove any references to Redux in your `package.json` and reinstall modules.