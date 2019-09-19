import React from 'react';
import './App.css';

import {LineSegment, VictoryChart, VictoryTooltip, VictoryAxis, VictoryStack, VictoryLabel, 
  VictoryLine, VictoryScatter, VictoryTheme, VictoryVoronoiContainer}  from 'victory';
import * as data from './MockData';

function formatDateForLabel(dateString) {
  let d = new Date(0);
  d.setUTCSeconds(dateString);
  return d.toLocaleDateString();
}


// https://stackblitz.com/edit/victory-chart-demo

function App() {
  return (
    <div style={{ width: '100vw', height: '40vh' }}>
      <VictoryChart
        containerComponent={
          <VictoryVoronoiContainer
            text="what!!"
            labels={ d => `y: ${ d.disp_los }`}
            labelComponent={
              <VictoryTooltip
                cornerRadius={3}
                flyoutStyle={{ 
                  fill: "white",
                  strokeWidth: 1
                }}
              />
            }
          />
        }
        width={900}
        height={400}
        theme={VictoryTheme.material}
        
        animate={true}
      >
       <VictoryAxis
       
        animate={{
          duration: 200,
          easing: "bounce"
        }}
        axisComponent={<LineSegment type={"axis"}/>}
        dependentAxis={true}
       />
        <VictoryStack
            colorScale={"warm"}
        >
          <VictoryLine
            data={data.data}
            x={"acquisition_time"}
            y={"disp_los"}
            labelComponent={<VictoryLabel renderInPortal dy={-20}/>}
            maxDomain={{ y: 0.8}}
            minDomain={{ y: -0.8}}
          />

          <VictoryScatter
            data={data.data}
            x={"acquisition_time"}
            y={"disp_los"}
            maxDomain={{ y: 0.8}}
            minDomain={{ y: -0.8}}
          />
        </VictoryStack>
      </VictoryChart>

    </div>
  );
}

export default App;
