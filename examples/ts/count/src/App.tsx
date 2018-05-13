import * as React from 'react';
import { connect } from 'react-redux';
import { RematchDispatch, RematchRootState } from '@rematch/core';

import { models, select } from './store';

const mapState = (state: RematchRootState<models>) => ({
  dolphins: state.dolphins,
  sharks: select.sharks.total(state),
});

const mapDispatch = (dispatch: RematchDispatch<models>) => ({
  incrementDolphins: dispatch.dolphins.increment,
  incrementDolphinsAsync: dispatch.dolphins.incrementAsync,
  incrementSharks: () => dispatch.sharks.increment(1),
  incrementSharksAsync: () => dispatch.sharks.incrementAsync(1),
  incrementSharksAsync2: () => dispatch({ type: 'sharks/incrementAsync', payload: 2 }),
});

interface CountProps extends Partial<ReturnType<typeof mapState>>,
Partial<ReturnType<typeof mapDispatch>> {}

const Count: React.SFC<CountProps> = props => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div style={{ width: 120 }}>
      <h3>Dolphins</h3>
      <h1>{props.dolphins}</h1>
      <button onClick={props.incrementDolphins}>+1</button>
      <button onClick={props.incrementDolphinsAsync}>Async +1</button>
    </div>
    <div style={{ width: 200 }}>
      <h3>Sharks</h3>
      <h1>{props.sharks}</h1>
      <button onClick={props.incrementSharks}>+1</button>
      <button onClick={props.incrementSharksAsync}>Async +1</button>
      <button onClick={props.incrementSharksAsync2}>Async +2</button>
    </div>
    <p>Using Rematch Models</p>
  </div>
);

export default connect(mapState, mapDispatch)(Count);
