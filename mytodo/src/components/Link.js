import React from 'react';
import PropTypes from 'prop-types'

const Link = (store) => { //{ active, children, onClick }
  debugger
  return (
    <button
      onClick={store.onClick}
      disabled={store.active}
      style={{
        marginLeft: '4px'
      }}
    >
      {store.children}
    </button>
  )
}
Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Link