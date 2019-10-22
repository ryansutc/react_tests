import React from 'react';
import { loadModules } from 'esri-loader';
import SearchIcon from '@material-ui/icons/Search';
import Fab from '@material-ui/core/Fab'; //floating action buttons
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    position: "absolute",
    bottom: 100,
    right: 30,
    zIndex: 3500 
  }  
});

function QueryButton(props) {
  const classes = useStyles();
  const {loading, featureLayer, bufferPtsGraphicsLayer, dist} = props;

  const getPtIdsAroundSamplePts = async function() {
    let transectPtData = {};
    let samplePtId = 0;
    for (var bufferPt of bufferPtsGraphicsLayer.graphics.items) {
      var query = featureLayer.createQuery();
      query.geometry = bufferPt.geometry; //lets start by just looking at 1st pt!
      query.distance = 0;
      query.units = "meters";
      query.spatialRelationship = "intersects";
      query.returnGeometry = false;
      query.outFields = ["pt_id"];
      
      let pt_ids = await featureLayer.queryFeatures(query).then((response) => {
        var features = response.features;
        console.log("found: " + features.length);
        return features.map(feature => {
          return feature.attributes.pt_id;
        });
      });

      transectPtData[samplePtId] = pt_ids;
      samplePtId += props.dist;
    }

    return transectPtData;

  }; //end getPtIdsAroundSamplePts

  const queryFeatures = () => {
    if(bufferPtsGraphicsLayer.graphics.length == 0) {
      alert("You don't have any sample pts");
      return
    }
    // handle querying point displacement data
    loadModules([
      'esri/tasks/support/Query',
    ]).then(([Query]) => {
      // lets try a query here:

      getPtIdsAroundSamplePts().then(transectPtData => {
        console.log(transectPtData);
      });

    })
  }

  if(loading === false && bufferPtsGraphicsLayer) {
    return (
      <div className={classes.root}>
        <Fab onClick={queryFeatures}
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

export default QueryButton;