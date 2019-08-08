import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Links'

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter
  // need to do something for totalTodos?
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)