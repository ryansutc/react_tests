import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Chip from "@material-ui/core/Chip";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import moment from 'moment';

const styles = theme => ({
  tooltip: {
    padding: 15,
    width: 180
  }
});

function formatDateForLabel(dateString) {
  let d = new Date(0);
  d.setUTCSeconds(dateString);
  return d.toLocaleDateString();
}


const colors = [
  "#2464a8",
  "#ffba44",
  "#a82445",
  "#00c7f9",
  "#9500f9",
  "#00f932"
];

class ChartTooltip extends Component {

  formatDateRange(startDate, endDate) {
    return moment(startDate).diff(endDate, "days");
  }

  render() {
    const { classes, active } = this.props;
    if (active) {
      const { payload, label } = this.props;
      let massSelection = payload.length > 6;
      let payloadItems;
      massSelection
        ? (payloadItems = payload.filter(pl => pl.dataKey === "average"))
        : (payloadItems = payload);
      return (
        <Paper>
          <Grid container className={classes.tooltip}>
            <Grid item>
              <Typography paragraph>
                {(massSelection ? "Average at " : "At ") +
                  `${formatDateForLabel(label)} \n( Over ${this.formatDateRange(formatDateForLabel(label), this.props.startDate, "days")} days):`
                }
              </Typography>
            </Grid>
            <Grid
              container
              direction="column"
              spacing={8}
              alignItems="stretch"
              justify="space-evenly"
            >
              {payloadItems.map((pl, index) => {
                return (
                  <Grid item key={index}>
                    <Chip
                      size='small'
                      color="primary"
                      label={Math.round(pl.value * 100) / 100 + " " + pl.unit}
                      style={{ backgroundColor: colors[index], width: "100%" }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Paper>
      );
    }
    else {
      return null;
    }
  }
}

export default withStyles(styles)(ChartTooltip);
