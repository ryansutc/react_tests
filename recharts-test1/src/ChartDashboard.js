import React from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';

import Chart from './Chart';
import ToolList from './ToolList';
import { borderColor } from '@material-ui/system';
import { NONAME } from 'dns';

const useStyles = makeStyles(theme => ({
  root: {
    padding: "35px",
    height: "30vh",
    [theme.breakpoints.only('xs')]: {
      minHeight: '80vh'
    },
    backgroundColor: "darkgrey",
    minHeight: '260px',
    minWidth: '300px'

  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: 'none',
    //color: theme.palette.text.secondary,
    height: "100%"
  },
  gridContainer: {
    direction: "row",
    height: "100%",
    [theme.breakpoints.only('xs')]: {
      direction: "column",
      height: '40%',
      minHeight: '300px'
    },
    //backgroundColor: "blue",
    
  },
  chartItem: {
    //backgroundColor: "red",
    height: '100%',
    alignItems: 'center',
    maxHeight: '500px',
    [theme.breakpoints.only('xs')]: {
      height: '80%'
    },
  },
  toolList: {
    //backgroundColor: "red",
    height: '100%',
    [theme.breakpoints.only('xs')]: {
      height:'20%',
      width: '100%'
    }
  }
}));

export default function ChartDashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container className={classes.gridContainer} id="dashboardRoot" spacing={3} alignItems="center" >
        <Grid item xs={12} sm={10} md={11} className={classes.chartItem}>
          <Paper className={classes.paper}>
            <Chart/>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={2} md={1} className={classes.toolList}>
          <Paper className={classes.paper}>
            <ToolList/>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}