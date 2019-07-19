import { createStore } from 'redux'

// 1 create a REDUCER:
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1 
        case 'DECREMENT':
            return state - 1 
        default:
            return state
    }
}

// 2 create a Redux STORE (subscribe, dispatch, getState):
let store = createStore(counter)

// subscribe(): update UI in response to state changes (or view binding library like React-Redux)
store.subscribe(() => console.log(store.getState()))

// to change/mutate state we need to 'dispatch an action':
store.dispatch({ type: 'INCREMENT' });

// console.log(store.getState())


//---------------

document.getElementById('increment')
    .addEventListener('click', function() {
        store.dispatch({ type: 'INCREMENT' })
    });

document.getElementById('decrement')
    .addEventListener('click', function() {
        store.dispatch({ type: 'DECREMENT' })
    })
