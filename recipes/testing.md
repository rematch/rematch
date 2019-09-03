# Testing

* Todo Example: [React](https://codesandbox.io/s/yvpy2zr8mj)

## Reducers

Testing with store.

```jsx
  import { init } from "@rematch/core";
  import myModel from './myModel';

  describe("myModel model", () => {
    it("reducer: my reducerName should do something", () => {
      const store = init({
        models: { myModel }
      });

      store.dispatch.myModel.reducerName(payload);

      const myModelData = store.getState().myModel;
      expect(myModelData).toBe("something");
    });
  });
```

Testing reducers directly.

```jsx
  import myModel from './myModel';

  describe("myModel model", () => {
    it("reducer: my reducerName should do something", () => {
      const result = myModel.reducers.reducerName(payload);
      expect(result).toBe("something");
    });
  });
```

## Effects

Testing with store.

```jsx
  import { init } from "@rematch/core";
  import myModel from './myModel';

  describe("myModel model", () => {
    it("effect: my effectName should do something", async () => {
      const store = init({
        models: { myModel }
      });

      await store.dispatch.myModel.effectName(payload);

      const myModelData = store.getState().myModel;
      expect(myModelData).toBe("something");
    });
  });
```

Testing effects directly.

```jsx
  import myModel from './myModel';

  describe("myModel model", () => {
    it("effect: my effectName should do something", async () => {
      const reducerMockFn = jest.fn();

      // bind the functions you want to check
      await myModel.effects.effectName.call({ reducerThatIsGoingToBeCalled: reducerMockFn }, payload);

      // checking if it was called
      expect(reducerMockFn).toHaveBeenCalled();

      // checking if it was called with the expected params
      expect(reducerMockFn).toHaveBeenCalledWith("something");
    });
  });
```

