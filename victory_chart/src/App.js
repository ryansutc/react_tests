import React, { PureComponent } from 'react';
import './App.css';

import {
  LineSegment, VictoryChart, VictoryTooltip, VictoryAxis, VictoryStack, VictoryLabel,
  VictoryLine, VictoryScatter, VictoryTheme, VictoryVoronoiContainer, VictoryGroup
} from 'victory';
import * as data from './MockData2';


function formatDateForLabel(dateString) {
  let d = new Date(0);
  d.setUTCSeconds(dateString);
  return d.toLocaleDateString();
}


// https://stackblitz.com/edit/victory-chart-demo

function App() {
  var chartData = Object.values(data.data);
  var pt_ids = Object.keys(chartData[0]).filter(key => key !== "date");
  const colors = [
    "#2464a8",
    "#ffba44",
    "#a82445",
    "#00c7f9",
    "#9500f9",
    "#00f932"
  ];
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: "darkgrey" }}>

      <VictoryChart
        padding={{ left: 80, right: 80, bottom: 80, top: 10 }}
        animate={false} //NEED to be able to set font size
        width={800} height={300}
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryVoronoiContainer
            theme="material"
            voronoiDimension="x"
            title="Cumulative Displacement Chart"
            desc="Chart showing relative surface displacement over time"
          />
        }
      >

        <VictoryAxis name="Y access"
          axisComponent={<LineSegment type={"axis"} />}
          dependentAxis={true} //this means it is y axis?
          label="cm"
          standalone={false}
          key="Y access"
          style={{
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        // TODO need to add ticks for axis
        // TODO need to add properties to force labelling of min/max domain vals
        />
        <VictoryAxis name="X access"
          label="X Axis"
          key="X access"
          //tickFormat={(x) => formatDateForLabel(x)}
          tickLabelComponent={<CustomizedAxisTick />}
          standalone={false}
          axisValue={-50} // TODO: make either min of data or range value variable

          style={{

            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        // TODO need to add ticks for axis
        />

        <VictoryLine name="ZeroLine" key="zeroline"
          domain={{ x: [1399874039, 1480443090] }} // TODO needs to dynamically be first and last value
          y={() => 0} // TODO make dynamic to mid val

          style={{
            data: { stroke: "yellow", strokeWidth: 1.2 }
          }}
        />

        <VictoryGroup
          domain={{ x: [1399874039, 1480443090], y: [-50, 50] }} // TODO make dynamic
          labels={({ datum }) => `y: ${datum._y}`}
          labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{ fill: "white" }} />}
        >
          {

            // lets loop through all items in data and create a new Line and 
            pt_ids.map((pt_id, index, array) => {

              return (<VictoryLine
                key={pt_id + " line"}
                name={pt_id + " line"}
                animate={true}
                data={chartData}
                x="date"
                y={pt_id}
                interpolation="linear"
                style={{
                  data: { stroke: colors[index], strokeWidth: 2 }
                }}
              />)
            })

          }

          {
            pt_ids.map((pt_id, index, array) => {

              return (<VictoryScatter
                key={pt_id + "scatter"}
                name={pt_id + "scatter"}
                size={({ active }) => active ? 5 : 3}
                data={chartData}
                x="date"
                y={pt_id}
                style={{
                  data: { fill: colors[index] },
                  labels: { fill: colors[index] }
                }}
              />)
            })
          }



        </VictoryGroup>
      </VictoryChart>

    </div>
  );
}


class CustomizedAxisTick extends PureComponent {
  //https://formidable.com/open-source/victory/docs/victory-axis#ticklabelcomponent
  render() {
    const { x, y, datum } = this.props;
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
          {formatDateForLabel(datum)}
        </text>
      </g >
    );
  }
}

export default App;
