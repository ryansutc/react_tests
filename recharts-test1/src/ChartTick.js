import React, { PureComponent } from 'react';
import { formatDateForLabel } from './helperFunctions';

export default class CustomizedAxisTick extends PureComponent {

  render() {
    const { x, y, payload } = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          //fill={axisTickColor}
          transform="rotate(-35)"
          style={this.props.style}
        >
          {formatDateForLabel(payload.value)}
        </text>
      </g >
    );
  }
}