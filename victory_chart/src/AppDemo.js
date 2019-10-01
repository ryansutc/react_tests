import React, { PureComponent } from 'react';
import './App.css';

import {
  LineSegment, VictoryChart,  VictoryAxis, VictoryTheme
} from 'victory';
import * as data from './MockData2';
import moment from 'moment';

function formatDateForLabel(dateString) {
  let d = new Date(0);
  d.setUTCSeconds(dateString);
  return d.toLocaleDateString();
}


/*************
 * A MINIMAL MVC EXAMPLE OF GRID ALIGNMENT ISSUES
 * as per post on Stack Overflow here:
 * https://stackoverflow.com/questions/58070912/how-to-align-axis-gridcomponent-to-non-zero-value-in-victorycharts
 */

function App() {
  return (
    <div >
      <VictoryChart
        width={800} height={300}
        theme={VictoryTheme.material}
      >

        <VictoryAxis
          axisComponent={<LineSegment type={"axis"} />}
          dependentAxis={true} //this means it is y axis?
          standalone={false}
          key="Y access"
          style={{
            tickLabels: { fontSize: 10, padding: 5 }
          }}
          domain={[-50, 50]}
        />
        
        <VictoryAxis name="X access"
          standalone={false}
          axisValue={-50} // NEED this axis to draw at bottom of Y axis
          domain={[1994, 2019]}
          gridComponent={<LineSegment y1={50} y2={250}/>} // do something here with LineSegment primitive properties to get it to start at proper y val...
          // https://formidable.com/open-source/victory/docs/victory-primitives#line
        />
              
       
      </VictoryChart>

    </div>
  );
}
export default App;
