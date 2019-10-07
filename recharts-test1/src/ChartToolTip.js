import React from 'react';

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import { formatDateRange, formatDateForLabel } from './helperFunctions';
import { Chip } from '@material-ui/core';


const useStyles = makeStyles({
  tooltip: {
    padding: 15,
    width: 180
  }
});

const colors = [
  "#2464a8",
  "#ffba44",
  "#a82445",
  "#00c7f9",
  "#9500f9",
  "#00f932"
];

export default function ChartToolTip(props) {
  const { active, label, startDate, payload } = props;

  const classes = useStyles(props);
  return active ? (
    <Paper>
      <Grid container className={classes.tooltip}>
        <Grid item>
          <Typography paragraph>
            {`${formatDateForLabel(label)} (Over ${formatDateRange(formatDateForLabel(label), formatDateForLabel(startDate), "days")} days):`}
          </Typography>
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          justify="space-evenly"
        >
          {payload.map((pl, index) => {
            return (
              <Grid item key={index}>
                <Chip
                  size='small'
                  color='primary'
                  label={Math.round(pl.value * 100) / 100 + " cm"}
                  style={{ backgroundColor: colors[index], width: '100%' }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Paper>
  ) : null
}

