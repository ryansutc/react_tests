import React from 'react'
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import Counter from './components/Counter'
import counter from './reducers'

// 1 create a REDUCER:
// moved to seperate file...

// 2 create a Redux STORE (subscribe, dispatch, getState):
const store = createStore(counter)
const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
    <Counter
        value={store.getState()}
        onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
        onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
    />,
    rootEl
)

render()

// subscribe(): update UI in response to state changes (or view binding library like React-Redux)
store.subscribe(render)

// to change/mutate state we need to 'dispatch an action':
store.dispatch({ type: 'INCREMENT' });

