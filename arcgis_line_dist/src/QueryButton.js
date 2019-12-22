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
  const {loading, featureLayer, bufferPtsGraphicsLayer, view, dist} = props;

  

  // what happens if we set up a layerView listener here? Does it persist after this?
  let dataLayerView = null;
 
  /**
   * This is a chatty way to get transect line vals for chart. The method
   * calls a fetch from our ArcGIS Server REST endpoint for every sample/buffer area.
   */
  const getPtIdsAroundSamplePts = async function() {
    let transectPtData = {};
    let samplePtId = 0;

    // firing a network request query for every buffer area:
    for (var bufferPt of bufferPtsGraphicsLayer.graphics.items) {
      var query = featureLayer.createQuery();
      query.geometry = bufferPt.geometry; //lets start by just looking at 1st pt!
      query.distance = 0;
      query.units = "meters";
      query.spatialRelationship = "intersects";
      query.returnGeometry = false;
      query.outFields = ["pt_id", "value"];
      
      await featureLayer.queryFeatures(query).then((response) => {
        var features = response.features;
        console.log("found: " + features.length);

        let newPt_ids = features.map(feature => {
          return feature.attributes.pt_id;
        });

        let avgVals = features.map(feature => {
          return feature.attributes.value;
        });

        transectPtData[samplePtId] = {};
        transectPtData[samplePtId]["pt_ids"] = newPt_ids;
        let sum, avg = 0;
        if (avgVals.length) {
          sum = avgVals.reduce((ttl,curr) => ttl + curr);
          avg = sum / avgVals.length;
        }
        transectPtData[samplePtId]["avgVal"] = avg;
      });

      samplePtId += props.dist;

    }

    return transectPtData;

  }; //end getPtIdsAroundSamplePts

   /**
   * This is a more direct way to get transect line vals for chart. The method
   * calls a fetch from our ArcGIS Server REST endpoint for all buffer areas at once then processes them after.
   */
  const getPtIdsAroundSamplePtsV2 = async function(geometryEngine) {
    let transectPtData = {};
    let samplePtId = 0;

    // first lets get a union element for all buffers and zoom to that:
    let bufferGeoms = [];
    for (var bufferPt of bufferPtsGraphicsLayer.graphics.items) {
      bufferGeoms.push(bufferPt.geometry);
    }
    var unionedBuffers = geometryEngine.union(bufferGeoms);
    view.goTo(unionedBuffers);

    // get dataPts LayerView assuming its first layer in map that is a 2D featureLayer...
    let dataPtsLayerView = view.layerViews.find(layerView => {
      return (
        layerView.declaredClass === "esri.views.2d.layers.FeatureLayerView2D"
      );
    });

    // dataPtsLayerView.queryGraphics().then(results => {
    //   console.log("here are results " + results);
    // });
    for (var bufferPt of bufferPtsGraphicsLayer.graphics.items) {
      let results = await dataPtsLayerView.queryFeatures({
        geometry: bufferPt.geometry,
        outFields: ["*"],
        spatialRelationship: "intersects",
        returnGeometry: false
      }); //.then(results => {
      let graphics = results.features;

      let avgVals = graphics.map(graphic => {
        return graphic.attributes.value;
      });

      transectPtData[samplePtId] = {};

      let sum, avg = 0;
      if (avgVals.length) {
        sum = avgVals.reduce((ttl,curr) => ttl + curr);
        avg = sum / avgVals.length;
      }
      transectPtData[samplePtId]["avgVal"] = avg;

      samplePtId += props.dist;
      //});
    }
    
    console.log(transectPtData);

  }; //end getPtIdsAroundSamplePts

  const queryFeatures = () => {
    if(bufferPtsGraphicsLayer.graphics.length == 0) {
      alert("You don't have any sample pts");
      return
    }
    // handle querying point displacement data
    loadModules([
      'esri/tasks/support/Query',
      'esri/geometry/geometryEngine'
    ]).then(([Query, geometryEngine]) => {
      // lets try a query here:

      // getPtIdsAroundSamplePts().then(transectPtData => {
      //   console.log(transectPtData);
      // });

      getPtIdsAroundSamplePtsV2(geometryEngine);

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