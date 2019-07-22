import { VisibilityFilters } from '../actions'

const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.visibilityFilter //switched from action to action.visibilityFilter
    default:
      return state
  }
}

export default visibilityFilter