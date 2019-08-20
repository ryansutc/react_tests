import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import sum from './sum'

export default combineReducers({
    todos,
    visibilityFilter,
    sum
})


