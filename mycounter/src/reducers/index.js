export default (state = { value: 0, count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return Object.assign({}, state, { value: state.value + 1, count: state.count + 1 })
    case 'DECREMENT':
      return Object.assign({}, state, { value: state.value - 1, count: state.count + 1 })
    default:
      return state
  }
}