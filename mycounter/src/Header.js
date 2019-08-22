import React from 'react'
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import Counter from './components/Counter'
import reducer from './reducers'
import Posts from './components/Posts'
import { AppBar, Typography } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar'
import NavBar from './components/navbar';

function Header(props) {

  return (
    <AppBar color="primary" position="static">
      <Toolbar>
        <Typography variant="h4" color="inherit">
          Counter Example
          </Typography>
        <NavBar></NavBar>
      </Toolbar>
    </AppBar>
  )
}

export default Header;