import React from 'react';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import Chart from './Chart';

const useStyles = makeStyles(theme => ({
  root: {
    padding: "25px",
    height: "45vh",
    [theme.breakpoints.only('xs')]: {
      height: '80vh'
    },
    backgroundColor: "darkgrey",
    minHeight: '280px',
  }
}));

export default function ChartDashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container id="dashboardRoot" spacing={3} alignItems="center" >
        <Chart />
      </Grid>
    </div>
  );
}