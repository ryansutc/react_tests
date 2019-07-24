import '@testing-library/react/cleanup-after-each';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent, Queries} from '@testing-library/react';

import React from 'react';
import NewPost from './NewPost';
import CreatePost from '../containers/CreatePost';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import App from './App';

import { createStore } from 'redux';
import rootReducer from '../reducers';


// normally here you'd do:
// const div = document.createElement('div');
//     const store = createStore(
//         rootReducer,
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//         );
        
//         ReactDOM.render(
//             <Provider store={store}>
//                 <CreatePost />
//             </Provider>, div);
// but for this test we'll umm... not do that :)

// Now here's what your test will look like:

function renderWithRedux(ui,
  {initialState, store = createStore(rootReducer, initialState)} = {},
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}

test('show that a new post was created on create Post click', () => {
    const {getByLabelText, getByPlaceholderText, getByText, container} = renderWithRedux(
        <App />,
    )
        //okay, we want to add title and body to the NewPost form, can 
        // we just update state? Or we gotta mock filling form?
        
        let message = 'hey there, this is the body';
        //see: https://testing-library.com/docs/guide-which-query
        fireEvent.change(getByPlaceholderText(/title/i), {target: {value: 'chuck norris'}})
        fireEvent.change(getByPlaceholderText(/body/i), {target: {value: message}})
            
        fireEvent.click(getByText("Add Post"))
        
        //ReactDOM.unmountComponentAtNode(div);
        expect(getByText(message)).toBeInTheDocument();
})