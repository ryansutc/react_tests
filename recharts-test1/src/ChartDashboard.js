import React from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';

import Chart from './Chart';
import ToolList from './ToolList';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: "35px"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function ChartDashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={10}>
          <Paper className={classes.paper}>
            <Chart />
          </Paper>
        </Grid>
        <Grid item xs={4} sm={2} >
          <Paper className={classes.paper}>
            <ToolList />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}