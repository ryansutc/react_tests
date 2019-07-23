import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../reducers';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  
  ReactDOM.render(
      <Provider store={store}>
          <App />
      </Provider>, div);

  ReactDOM.unmountComponentAtNode(div);
});
