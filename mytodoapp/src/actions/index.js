/*
* these are our action creators:
* https://redux.js.org/basics/actions
*/

let nextTodoId = 0
let totalTodos = 0

export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
/*
export const todoCount = text => ({
  type: 'TODO_COUNT',
  value
}) 
*/

// action creator here?
export const todoCounts = value => ({
  type: 'TODO_COUNT', 
  value: totalTodos++ 
})

// to actually initiate a dispatch, we pass the result to the dispatch() function.