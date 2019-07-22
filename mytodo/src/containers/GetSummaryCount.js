import { connect } from 'react-redux'
import SummaryCount from '../components/SummaryCount'
import { VisibilityFilters } from '../actions'
import { switchStatement } from '@babel/types';


const mapStateToProps = state => {

  return (
    {
      total: state.todos.counts.total,
      active: state.todos.counts.active,
      completed: state.todos.counts.completed
    })
}
/*
const mapDispatchToProps = dispatch => ({
  
  // do we need to do anything here?
})
*/

export default connect(
  mapStateToProps,
  null // switched to null
)(SummaryCount)