import * as React from 'react';
import { connect } from 'react-redux';

interface CountProps {
    incrementSharks: () => void;
    incrementDolphins: () => void;
    incrementSharksAsync: () => void;
    incrementDolphinsAsync: () => void;
    dolphins: number;
    sharks: number;
}

const Count = (props: CountProps) => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div style={{ width: 120 }}>
      <h3>Sharks</h3>
      <h1>{props.sharks}</h1>
      <button onClick={props.incrementSharks}>+1</button>
      <button onClick={props.incrementSharksAsync}>Async +1</button>
    </div>
    <div style={{ width: 120 }}>
      <h3>Dolphins</h3>
      <h1>{props.dolphins}</h1>
      <button onClick={props.incrementDolphins}>+1</button>
      <button onClick={props.incrementDolphinsAsync}>Async +1</button>
    </div>
    <p>Using Rematch Models</p>
  </div>
);

const mapState = (state: any) => ({
  sharks: state.sharks,
  dolphins: state.dolphins,
});

const mapDispatch = (dispatch: any) => ({
  incrementSharks: dispatch.sharks.increment,
  incrementDolphins: dispatch.dolphins.increment,
  incrementSharksAsync: dispatch.sharks.incrementAsync,
  incrementDolphinsAsync: dispatch.dolphins.incrementAsync,
});

export default connect(mapState, mapDispatch)(Count);
