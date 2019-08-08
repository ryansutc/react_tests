import { LineChart, Line, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';
import React from 'react';
//const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }]
import {data} from './MockData';

const domainMin = -1.25;
const domainMax = 1.45;

function formatDateForLabel(dateString) {
  let d = new Date(0);
  d.setUTCSeconds(dateString);
  return d.toLocaleDateString();
}

function calculateDomainOfChart(data, domain, type) {
  // lets set the Y-Axis range to be either the set val
  // or the min/max of the data rounded to nice decimal numbers
  if (type.toUpperCase() === "MIN") {
    let min = data < domain ? 
    	-Math.ceil(Math.abs(data * 10)) / 10 : // round data down to 1 decimal
      domain // don't round domain
   	return min 
   }
  if (type.toUpperCase() === "MAX") {
    let max = data > domain ?
    	Math.ceil(Math.abs(data * 10)) / 10 : // round data up to 1 decimal
      domain // don't round domain
     return max
  }
  else {
    throw console.error(`Invalid type: ${type}. Must be 'MIN' or 'MAX'`);
  }
}

export default function Chart(props) {
  return (
    <LineChart 
      width={props.width} 
      height={props.height} 
      data={data}
      margin={{ top: 5, right: 45, bottom: 45, left: 25 }}
      
    >
      <XAxis 
        dataKey="acquisition_time"
        tick={<CustomizedAxisTick />} 
      />
      <YAxis 
        type="number" 
        domain={[dataMin => (calculateDomainOfChart(dataMin, domainMin, "MIN")), 
                dataMax => (calculateDomainOfChart(dataMax, domainMax, "MAX"))]}
        allowDecimals="false"
      />
      <Line 
        type="monotone" 
        dataKey="disp_los" 
        stroke="#8884d8" 
        dot={{ stroke: 'red', strokeWidth: 2 }} 
        unit="cm"
      />
      <ReferenceLine y={domainMax} stroke="blue"/>
      <ReferenceLine y={domainMin} stroke="red"/>
      <ReferenceLine y='0' stroke="white"/>
      <CartesianGrid strokeDasharray="3 3" />
      
    </LineChart>
  )
}


class CustomizedAxisTick extends React.Component {
  render() {
    const { x, y, payload } = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          transform="rotate(-35)"
        >
          {formatDateForLabel(payload.value)}
        </text>
      </g>
    );
  }
}