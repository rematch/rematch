import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import { init } from '@rematch/core';
import { Provider } from 'react-redux';

import sharks from './models/sharks';
import dolphins from './models/dolphins';

const store = init({
  models: {
    sharks,
    dolphins,
  },
});

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root') as HTMLElement
);
