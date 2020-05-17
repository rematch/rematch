import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'

ReactDOM.render(
  <React.StrictMode>
		<Provider store={store}>
			// @ts-ignore
			<App />
		</Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
