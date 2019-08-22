import React, { Component } from 'react';
import CounterDisplay from './CounterDisplay';
import Button from '@material-ui/core/Button';
import { Card, Grid, Paper } from '@material-ui/core';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

// this is a cool library that allows for the Runtime checking of React props and making sure that
// they are correct (https://www.npmjs.com/package/prop-types)
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
  },
  paper: {
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  container: {
    padding: 10,
    margin: 10
  }
}))

function incrementIfOdd(store) {
  if (store.value % 2 !== 0) {
    store.dispatch({ type: 'INCREMENT', value: store.value })
  }
}

const Counter = (store) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.container}>
      <Card className={classes.container}>
        Counter: {store.value}
        {' '}
        <Button size="small" variant="contained" color="primary" onClick={() => store.dispatch({ type: 'INCREMENT', value: store.value })}>
          +
          </Button>
        {' '}
        <Button size="small" variant="contained" color="primary" onClick={() => store.dispatch({ type: 'DECREMENT', value: store.value })}>
          -
          </Button>
        {' '}
        <Button size="small" variant="contained" color="secondary" onClick={() => incrementIfOdd(store)} >
          Increment if odd
          </Button>
        {' '}
        <CounterDisplay
          count={store.count}
        />
      </Card>
    </Grid >
  )
}
// type control of params passed:

const mapStateToProps = (state, ownProps) => ({
  value: state.value,
  count: state.count
})

export default connect(mapStateToProps, null)(Counter)