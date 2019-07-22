import React from 'react';
import PropTypes from 'prop-types'

const SummaryCount = ({ total = 0, active = 0, completed = 0 }) => (
  <div>
    <p>
      Total: {total}, Active: {active}, Completed: {completed}
    </p>
  </div>
)

SummaryCount.propTypes = {
  total: PropTypes.number.isRequired,
  active: PropTypes.number.isRequired,
  completed: PropTypes.number.isRequired
}

export default SummaryCount
