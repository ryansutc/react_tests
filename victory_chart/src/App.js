import React, { PureComponent } from 'react';
import './App.css';

import {LineSegment, VictoryChart, VictoryTooltip, VictoryAxis, VictoryStack, VictoryLabel, 
  VictoryLine, VictoryScatter, VictoryTheme, VictoryVoronoiContainer, VictoryGroup}  from 'victory';
import * as data from './MockData';

import ChartToolTip from "./ChartToolTip";
import SimpleToolTip from "./SimpleToolTip";
import CustomFlyOut from './CustomFlyOut';

function formatDateForLabel(dateString) {
  let d = new Date(0);
  d.setUTCSeconds(dateString);
  return d.toLocaleDateString();
}


// https://stackblitz.com/edit/victory-chart-demo

function App() {
  return (
    <div style={{width: '100vw', height: '100vh'}}>
      
      <VictoryChart
        padding={{left: 80, right: 80, bottom: 80, top: 10}}
        animate={false} //NEED to be able to set font size
        width={800} height={300}
        containerComponent={
          <VictoryVoronoiContainer 
          />
        }
      >
        <VictoryAxis name="Y access"
          axisComponent={<LineSegment type={"axis"}/>}
          dependentAxis={true} //this means it is y axis?
          label="Displacement"
          standalone={false}
          // TODO need to add ticks for axis
          // TODO need to add properties to force labelling of min/max domain vals
        />
        <VictoryAxis name="X access"
          label="X Axis"
          //tickFormat={(x) => formatDateForLabel(x)}
          tickLabelComponent={<CustomizedAxisTick />}
          standalone={false}
          axisValue={-0.8} // TODO: make either min of data or range value variable
          // TODO need to add ticks for axis
        />

        <VictoryLine name="ZeroLine"
          domain={{x: [1209459281, 1232272484]}} // TODO needs to dynamically be first and last value
          y={() => 0} // TODO make dynamic to mid val

          style={{
            data: {stroke: "yellow", strokeWidth: 1.2},
          }}
        />  

        <VictoryStack
          domain={{x: [1209459281, 1232272484], y: [-0.8, 0.8]}} // TODO make dynamic
        >
          <VictoryGroup
            voronoiDimension="x"
            labels={({ datum }) => `y: ${datum._y}`}
            labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{fill: "white"}}/>}
            title="Cumulative Displacement Chart"
            desc="Chart showing relative surface displacement over time"
          >
            {
              // lets loop through all items in data and create a new Line and 
              // Scatter element for each:
              Object.keys(Object.values(data.data)[0])
                  .filter(key => key !== "date")
                  .map((pt_id, index, array) => {
                    let noOfLines =
                      Object.keys(Object.values(data.data)[0])
                        .length - 1;
                    let massSelection = noOfLines > 6;
                    let strokeWidth = massSelection ? 2 : 4;
                    return pt_id !== "average" ? (
                      <div>
                        <VictoryLine
                          name={pt_id}
                          animate={true}
                          data={data.data}
                          x="date"
                          y={`"${pt_id}"`}
                          interpolation="linear"
                          style={{
                            data: { stroke: "orange", strokeWidth: {strokeWidth}},
                            labels: { fill: "blue"}
                          }}     
                        />
                        <VictoryScatter
                          name={pt_id}
                          size={({ active }) => active ? 5 : 3}
                          data={data.data}
                          x="date"
                          y={`"${pt_id}"`}
                          style={{ data: { fill: "green"} }}
                        />
                      </div>
                    ) : null
            })
          }

            
          </VictoryGroup>
        </VictoryStack>
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
        >
          {formatDateForLabel(datum)}
        </text>
      </g>
    );
  }
}

export default App;
