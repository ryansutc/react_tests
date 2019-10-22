import React from 'react';
import { loadModules } from 'esri-loader';
import SearchIcon from '@material-ui/icons/Search';
import Fab from '@material-ui/core/Fab'; //floating action buttons
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    position: "absolute",
    bottom: 240,
    right: 30,
    zIndex: 3500 
  }  
});

function DummyDataGrabber(props) {
  const {bufferPtsGraphicsLayer, loading} = props;
  const classes = useStyles();

  if(loading === false && bufferPtsGraphicsLayer) {
    return (
      <div className={classes.root}>
        <Fab onClick={() => alert("hello")}
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