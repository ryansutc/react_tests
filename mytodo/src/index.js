import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/App';

import reducer from './reducers';

import { createStore } from 'redux' //todo: replace w. custom reducer

const rootElem = document.getElementById('root')

// lets alter createStore so that we can use Redux dev tools:
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
// Reducer: 

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElem
);

