import React, { PureComponent } from 'react';
import { useState, useEffect } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { makeStyles, withWidth } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {
  ResponsiveContainer, LineChart, ReferenceArea, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { data } from './MockData2';
import ToolList from './ToolList';
import CustomizedAxisTick from './ChartTick';
import ChartToolTip from './ChartToolTip';
import { formatDateForLabel } from './helperFunctions';

const useStyles = makeStyles(theme => ({
  paper: {
    textAlign: 'center',
  },
  gridContainer: {
    direction: "row",
    height: "100%",
    //alignItems: "stretch",
    [theme.breakpoints.only('xs')]: {
      direction: "column",
      //height: '40%',
      minHeight: '300px'
    },
    //backgroundColor: "blue",

  },
  chartItem: {
    flexGrow: 1,
    //backgroundColor: "red",
    //width: '100%',
    minWidth: '300px',
    alignItems: 'center',
    height: '100%',
    width: 0, //force resize (see SO issue: https://stackoverflow.com/questions/7985021/css-flexbox-issue-why-is-the-width-of-my-flexchildren-affected-by-their-content)
    [theme.breakpoints.only('xs')]: {
      height: '80%',
      maxHeight: '600px'
    }
  },
  toolList: {
    //backgroundColor: "red",
    height: '100%',
    width: '45px',
    [theme.breakpoints.only('xs')]: {
      height: '20%',
      width: '100%'
    }
  }
}))

export default function Chart(props) {
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [zoomLeft, setZoomLeft] = useState(0);
  const [zoomRight, setZoomRight] = useState(0);

  let chartData = Object.values(data);
  const dateStart = chartData[0].date;
  const dateEnd = chartData[chartData.length - 1].date;
  var pt_ids = Object.keys(chartData[0]).filter(key => key !== "date");
  const colors = [
    "#2464a8",
    "#ffba44",
    "#a82445",
    "#00c7f9",
    "#9500f9",
    "#00f932"
  ];

  const classes = useStyles();

  const zoom = () => {
    console.log("zoom was called");
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
    }

    if (refAreaLeft > refAreaRight) {
      setZoomRight(refAreaLeft);
      setZoomLeft(refAreaRight);
    }
    else {
      setZoomRight(refAreaRight);
      setZoomLeft(refAreaLeft);
    }

    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const zoomOut = () => {
    console.log("Zoom out was called");
    setZoomLeft(0);
    setZoomRight(0);
    setRefAreaLeft('');
    setRefAreaRight('');
  }
  const slideForward = () => {
    const startPt = zoomLeft;
    const endPt = zoomRight;
    const range = endPt - startPt;

    if (endPt === dateEnd) {
      //we're already at end. Don't slide
      return;
    }

    const newEndPt = Math.min(endPt + (range / 2), dateEnd);
    const newStartPt = newEndPt - range;

    setZoomLeft(newStartPt);
    setZoomRight(newEndPt);
    setRefAreaRight('');
    setRefAreaLeft('');
  }
  const slideBackward = () => {
    const startPt = zoomLeft;
    const endPt = zoomRight;
    const range = endPt - startPt;

    if (startPt === dateStart) {
      return
    }
    const newStartPt = Math.max(startPt - (range / 2), dateStart);
    const newEndPt = newStartPt + range;

    setZoomLeft(newStartPt);
    setZoomRight(newEndPt);
    setRefAreaRight('');
    setRefAreaLeft('');
  }

  const mobileWidth = useMediaQuery('(min-width:600px)');
  const mobileHeight = useMediaQuery('(min-height:500px)');
  return (
    <React.Fragment>
      <Grid item xs={12}>
        {`Cumulative Displacement from ${formatDateForLabel(dateStart)} to ${formatDateForLabel(dateEnd)} `}
      </Grid>
      <Grid item xs={12} sm={10} md={11} className={classes.chartItem}>

        <ResponsiveContainer height={mobileWidth && mobileHeight ?
          (window.innerHeight / 2.5) - 25 : (window.innerHeight / 1.8) - 25}>
          <LineChart
            onMouseDown={(e) => setRefAreaLeft(e.activeLabel)}
            onMouseMove={(e) => refAreaLeft ? setRefAreaRight(e.activeLabel) : null}//refAreaLeft && setRefAreaRight(e.activelabel)}
            onMouseUp={zoom}
            data={chartData}
            margin={{
              top: 20, right: 20, bottom: 40, left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              allowDataOverflow={true}
              type="number"
              domain={zoomLeft && zoomRight ? [zoomLeft, zoomRight] : ['dataMin', 'dataMax']}
              dataKey="date"
              tick={<CustomizedAxisTick />}
            />
            <YAxis />
            <Tooltip content={<ChartToolTip startDate={dateStart} />} />
            <Legend
              verticalAlign="top"
            />
            {pt_ids.map((pt_id, index) => {
              return (<Line key={pt_id} type="monotone" dataKey={pt_id} stroke={colors[index]} />)
            })}

            {
              (refAreaLeft && refAreaRight) ? (
                <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />) : null
            }

          </LineChart>
        </ResponsiveContainer>

      </Grid>
      <Grid item xs={12} sm={2} md={1} className={classes.toolList}>
        <ToolList
          forwardDisabled={!zoomLeft || zoomRight === dateEnd}
          backwardDisabled={!zoomRight || zoomLeft === dateStart}
          slideForward={slideForward}
          slideBackward={slideBackward}
          zoomOut={zoomOut}
          zoomOutDisabled={!zoomLeft && !zoomRight}
        />
      </Grid>
    </React.Fragment>
  );
}




