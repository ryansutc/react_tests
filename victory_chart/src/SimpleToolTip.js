import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Chip from "@material-ui/core/Chip";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import moment from 'moment';
import {VictoryTooltip} from 'victory';

class SimpleTooltip extends Component {
  static defaultEvents = VictoryTooltip.defaultEvents;
  render() {
    const {x, y} = this.props;
    const rotation = `rotate(45 ${x} ${y})`
      return (
        <div>
        <g transform={rotation}>
          <Chip label="clickable chip">Hello</Chip>
          <VictoryTooltip {...this.props} renderInPortal={false}>
          <Chip label="clickable chip">Hello</Chip>
            </VictoryTooltip>
        </g>
        </div>
      )
  }
}

export default SimpleTooltip;
