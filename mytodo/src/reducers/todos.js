const defaultState = { todos: [], counts: { total: 0, active: 0, completed: 0 } };

const todos = (state = defaultState, action) => {

  switch (action.type) {
    case 'ADD_TODO':
      let newtodos = state.todos.concat({ id: action.id, text: action.text, completed: false });
      let newcounts = Object.assign({}, state.counts, { total: state.counts.total + 1, active: state.counts.active + 1 });
      return { todos: newtodos, counts: newcounts }
    case 'TOGGLE_TODO':
      let newActive = state.counts.active;
      let newCompleted = state.counts.completed;
      let newTodos = JSON.parse(JSON.stringify(state.todos)); //deep cloning to troubleshoot and be 100% safe until I better understand store

      newTodos.map(todo => {
        if (todo.id === action.id) {
          if (todo.completed) {
            newActive++
            newCompleted--
          }
          else {
            newActive--
            newCompleted++
          }
          todo.completed = !todo.completed
        }
      });

      return {
        todos: newTodos, counts: { total: state.counts.total, active: newActive, completed: newCompleted }
      }
    default:
      return state
  }
}

export default todos