import React from 'react';
import moment from 'moment';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const styles = theme => ({
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

function formatDateForLabel(dateString) {
  let d = new Date(0);
  d.setUTCSeconds(dateString);
  return d.toLocaleDateString();
}

class CustomFlyout extends React.Component {

  formatDateRange(startDate, endDate) {
    return moment(startDate).diff(endDate, "days");
  }

  render() {
    const {x, y, orientation, datum, payloadItems} = this.props;
    const newY = orientation === "bottom" ? y - 35 : y + 35;
    return (

      <g>
        <circle cx={x} cy={newY} r="20" stroke="tomato" fill="none"/>
        <circle cx={x} cy={newY} r="25" stroke="orange" fill="none"/>
        <circle cx={x} cy={newY} r="30" stroke="gold" fill="none"/>
        <Chip
          size='small'
          color="default"
          label={"hahahahaha"}
          style={{ backgroundColor: colors[0], width: "100%" }}
        />
      </g>
      /*
      <Paper>
          <Grid container>
            <Grid item>
              <Typography paragraph>
                {`At ${formatDateForLabel(datum._x)} \n
                ( Over ${this.formatDateRange(formatDateForLabel(datum._x), this.props.startDate, "days")} days):`
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
      */
    );
  }
}

export default withStyles(styles)(CustomFlyout);