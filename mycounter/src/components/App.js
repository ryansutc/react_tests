import React from 'react'

import Counter from './Counter'
import Posts from './Posts'
import Header from '../Header';
import { connect } from 'react-redux';
import { container } from '@material-ui/core'
const App = (store) => {
  return (
    <div>
      <Counter />
      <Posts />
    </div>
  )
}

export default connect()(App);

