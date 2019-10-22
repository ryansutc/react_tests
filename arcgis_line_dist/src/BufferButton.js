import React from 'react';
import { loadModules } from 'esri-loader';
import BackupIcon from '@material-ui/icons/Backup';
import Fab from '@material-ui/core/Fab'; //floating action buttons
import CircularProgress from '@material-ui/core/CircularProgress';
import { projectToLatLong, projectToXY } from './GeomUtils';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    position: "absolute",
    bottom: 160,
    right: 30,
    zIndex: 3500
  }
});

function BufferButton(props) {
  const classes = useStyles();
  const { loading, featureLayer, samplePtsGraphicsLayer,
    bufferPtsGraphicsLayer, dist } = props;

  const bufferPts = () => {
    loadModules([
      'esri/Graphic',
      'esri/geometry/SpatialReference',
      "esri/geometry/geometryEngine",

    ])
      .then(([Graphic, SpatialReference,
        GeometryEngine]) => {
        let bufferId = 0;
        for (var item of samplePtsGraphicsLayer.graphics.items) {

          var ptAtts = {
            Name: "Sample Buffer",
            id: bufferId
          };

          projectToXY(item.geometry).then(pointGeomXY => {
            let geoBufferXY = GeometryEngine.buffer(pointGeomXY, dist / 2, "meters");
            projectToLatLong(geoBufferXY).then(geoBufferLatLong => {
              var polygonGraphic = new Graphic({
                geometry: geoBufferXY,
                symbol: {
                  type: "simple-fill",
                  color: [255, 255, 10, 0.3],
                  style: "solid"
                }
              });
    
              bufferPtsGraphicsLayer.add(polygonGraphic);
              bufferId += dist;
            });
          });
        };
      }); //end load modules
  } //end bufferPts

  if (loading === false && samplePtsGraphicsLayer) {
    return (
      <div className={classes.root}>
        <Fab onClick={bufferPts}
          color="secondary"
          label="Buffer Features"
        >
          <BackupIcon />
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

export default BufferButton;