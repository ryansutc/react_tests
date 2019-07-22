const defaultState = { posts: [] };

export default postReducer = (state = defaultState, action) => {
  if (action.type === 'ADD_POST') {
    return Object.assign({}, state, { posts: [...state.posts, { title: action.title, body: action.body }] });
  }
  else if (action.type === 'DELETE_POST') {
    return Object.assign({}, state, { posts: [...state] })
  }
}