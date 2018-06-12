import { ExtractRematchSelectorsFromModels, Model, Models, Plugin } from '@rematch/core'

export const select = {}

export function getSelect<M extends Models = Models>() {
	return select as ExtractRematchSelectorsFromModels<M>
}

export interface SelectConfig {
	sliceState?: any,
}

export const select = {};

const createSelectPlugin = ({
  sliceState = (rootState, model) => rootState[model.name]
}: SelectConfig = {}): Plugin => ({
  exposed: {
    select,
    createSelector(model: Model, selector: Function) {
      return (state: any, ...args) => selector(sliceState(state, model), ...args);
    }
  },
  onInit() {
    this.validate([
      [
        typeof sliceState !== "function",
        `createSelectPlugin's getState config must be a function. Instead got type ${typeof sliceState}.`
      ]
    ]);
  },
  onModel(model: Model) {
    select[model.name] = {};
    this.select[model.name] = {};

    const selectors =
      typeof model.selectors === "function"
        ? model.selectors(this.select)
        : model.selectors;

    Object.keys(selectors || {}).forEach((selectorName: String) => {
      this.validate([
        [
          typeof selectors[selectorName] !== "function",
          `Selector (${model.name}/${selectorName}) must be a function`
        ]
      ]);

      select[model.name][selectorName] = this.createSelector(
        model,
        selectors[selectorName].bind(this.select[model.name])
      );

      this.select[model.name][selectorName] = (...args) =>
        select[model.name][selectorName](this.storeGetState(), ...args);
    });
  }
});

export default createSelectPlugin;
