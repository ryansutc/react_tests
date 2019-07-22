import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'
import { VisibilityFilters } from '../actions'

const getVisibleTodos = (state, action) => {

  switch (action.visibilityFilter) {
    case VisibilityFilters.SHOW_ALL:
      return state.todos
    case VisibilityFilters.SHOW_COMPLETED:
      return state.todos.filter(t => t.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return state.todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + state.filter)
  }
}

const mapStateToProps = state => ({
  todos: getVisibleTodos(state.todos, state) //state.filter
})

const mapDispatchToProps = dispatch => {
  return ({
    toggleTodo: id => dispatch(toggleTodo(id))
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)