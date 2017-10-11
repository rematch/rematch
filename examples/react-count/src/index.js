import React from 'react'
import ReactDOM from 'react-dom'
import { init, model, dispatch, view } from 'rematch-x'
import RematchReact from 'rematch-react'

// init with the rematch-react plugin
init({
  view: RematchReact
})

// make a model
model({
  name: 'count',
  state: 0,
  reduce: {
    up: state => state + 1,
    down: state => state - 1,
    setTo: (state, value) => value
  },
  select: {
    addTen: (state) => state + 10,
    add: (state, {amount}) => state + amount
  }
})

// This is the replacement for react-redux's connect()
// Simply pass a component and the model state is available as a prop
const Count = view.count(props => (
  <h1>The count is: {props.count}</h1>
))

// If you need to select an even smaller chunks of the state,
// or calculate values based off specific parts of the
// state, make some selectors in the model.
// You access selectors values the same way...
const AddTen = view.count.addTen(props => (
  <h1>The count + 10 = {props.addTen}</h1>
))

// This selector takes an arg. Pass the args as a prop to the component.
const Add = view.count.add(props => (
  <h1>The count + {props.amount} = {props.add}</h1>
))

const App = () => (
  <div>
    <Count />
    <AddTen />
    <Add amount={100} />
    {/* dispatch changes to the store like this */}
    <button onClick={() => dispatch.count.up()}>Up</button>
    <button onClick={() => dispatch.count.down()}>Down</button>
    <button onClick={() => dispatch.count.setTo(99)}>Set to 99</button>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
