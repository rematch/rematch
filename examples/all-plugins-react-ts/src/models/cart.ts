import { createModelWithSelectors } from "@rematch/select"
import { RootModel } from "."

interface CartState {
  price: number;
  amount: number;
  productId: number;
}

export const cart = createModelWithSelectors<RootModel>()({
  state: [{
    price: 42.00,
    amount: 3,
    productId: 2,
  }] as CartState[],
  selectors: (slice, createSelector, hasProps) => ({
    // creates a simple memoized selector based on the cart state
    total () {
      return slice(cart =>
        cart.reduce((a, b) => a + (b.price * b.amount), 0)
      )
    },
    // // uses createSelector method to create more complex memoized selector
    // totalWithShipping () {
    //   return createSelector(
    //     slice, // shortcut for (rootState) => rootState.cart
    //     (rootState, props) => props.shipping,
    //     (cart, shipping) => cart.reduce((a, b) => a + (b.price * b.amount), shipping)
    //   )
    // },
    // // refers to the other selector from this model
    // doubleTotal () {
    //   return createSelector(
    //     this.totalWithShipping,
    //     (totalWithShipping: number) => totalWithShipping * 2,
    //   )
    // },
    // // accesses selector from a different model
    // productsPopularity (models) {
    //   return createSelector(
    //     slice, // shortcut for (rootState) => rootState.cart
    //     models.popularity.pastDay, // gets 'pastDay' selector from 'popularity' model
    //     (cart, hot) => cart.sort((a, b) => hot[a.productId] > hot[b.productId])
    //   )
    // },
    // // uses hasProps function, which returns new selector for each given lowerLimit prop
    // expensiveFilter: hasProps(function (models, lowerLimit) {
    //   return slice(items => items.filter(item => item.price > lowerLimit))
    // }),
    // // uses expensiveFilter selector to create a new selector where lowerLimit is set to 20.00
    // wouldGetFreeShipping () {
    //   return this.expensiveFilter(20.00)
    // },
  }),
})