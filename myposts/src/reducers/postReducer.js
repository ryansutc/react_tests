const defaultState = [];

const postReducer = (state = defaultState, action) => {
  if (action.type === 'ADD_POST') {
    return state.concat([{ id: action.payload.id, title: action.payload.title, body: action.payload.body }]);
  }
  else if (action.type === 'DELETE_POST') {
    return state.filter(post => post.id !== action.payload.id);
  }
  else {
    return state;
  }
}

export default postReducer;