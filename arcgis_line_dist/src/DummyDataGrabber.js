import React from 'react';
import { loadModules } from 'esri-loader';
import SearchIcon from '@material-ui/icons/Search';
import Fab from '@material-ui/core/Fab'; //floating action buttons
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/styles';

import { displacementData } from './dummyDisplacements';

const useStyles = makeStyles({
  root: {
    position: "absolute",
    bottom: 240,
    right: 30,
    zIndex: 3500
  }
});

/** Get all pt_ids in a dummyData set.
 * Used for testing only.
 */
function getPtIds(displacementData) {
  let pt_ids = [];
  for (var feature of displacementData.features) {
    let pt_id = feature.attributes.pt_id;
    if (!pt_ids.includes(pt_id)) {
      pt_ids.push(pt_id);
    }
  }

  console.log(pt_ids);
  return pt_ids;
}

/**
 * Calculate displacement totals for pts (pt_ids) over a set period
 * @param {Object} displacementData raw fetched displacement table data for 1:m pt_ids 
 * @param {number[]} pt_ids optional subset of pt_ids we wish to calculate totals from 
 * @param {number} startDate optional serial linux date time format for startDate
 * @param {number} endDate optional serial linux date time format for endDate
 */
function prepareDisplacementDataTotals(displacementData, pt_ids = null, startDate = 0, endDate = 99999999) {
  let rawData = {};
  if (!pt_ids) pt_ids = getPtIds(displacementData);

  for (var feature of displacementData.features) {
    let atts = feature.attributes;
    if (pt_ids.includes(atts.pt_id)) {
      if (atts.acquisition_time > startDate && atts.acquisition_time < endDate) {
        rawData[atts.pt_id].vals.push(atts.disp_los);
      }
    }
  }

  console.log(rawData);
  return rawData;
}

function averageDisplacementsForEachSampleArea(pt_data,sampleIds, dispfield) {
  let averages = {};
  for (var sampleId of sampleIds) {
    let totalDisp = 0;
    for (var pt_id of sampleId.pt_ids) {
      for (var row of pt_data) {
        if (row.pt_id === pt_id) {
          totalDisp += row[dispfield];
        }
      }
    }
    averages[sampleId] = totalDisp;
  }

  return averages;
}


function DummyDataGrabber(props) {
  const { bufferPtsGraphicsLayer, loading } = props;
  const classes = useStyles();

  const pt_ids = [
    38719202,
    38719203,
    38719204,
    38719205,
    38726666,
    38726667,
    38726668,
    38726669,
    38734130,
    38734131,
    38734132,
    38734133,
    38741594,
    38741595,
    38741596,
    38741597
  ];

  if (loading === false && bufferPtsGraphicsLayer) {
    return (
      <div className={classes.root}>
        <Fab onClick={() => prepareDisplacementDataTotals(displacementData, pt_ids)}
          color="secondary"
          label="Query Features"
        >
          <SearchIcon />
        </Fab>
      </div>
    )
  }
  else {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    )
  }
}

export default DummyDataGrabber;