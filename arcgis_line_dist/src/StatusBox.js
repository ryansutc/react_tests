import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    position: "absolute",
    top: 20,
    right: 30,
    minHeight: "70px", 
    minWidth: "70px", 
    backgroundColor: "white",
    zIndex: 3500 
  }  
});

function StatusBox(props) {
  const classes = useStyles();
  //console.log(props);
  return (
    <div className={classes.root}>
      <p><span>Status: {props.status} </span></p>
      <p><span>Distance: {props.distance}</span></p>
    </div>
  )
};

export default StatusBox;