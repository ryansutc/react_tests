import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOutTwoTone'
import ShowChartIcon from '@material-ui/icons/ShowChart'
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: 'center',
    //padding: "10px"
  },
  ul: {
    listStyleType: 'none',
    paddingLeft: 0
  },
  button: {
    //backgroundColor: "orange",
    textAlign: 'center',
    backgroundColor: theme.palette.text.secondary,
    marginTop: "10px",
  },
}));

export default function() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <li className={classes.ul}>
        <ul className={classes.ul}>
          <Tooltip title="Zoom In on Chart" placement="right">
            <IconButton className={classes.button}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
        </ul>
        <ul className={classes.ul}>
          <Tooltip title="Zoom Out to Full Extent" placement="right">
            <IconButton className={classes.button}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
        </ul>
        <ul className={classes.ul}>
          <Tooltip title="Go Back to Chart Full Extent" placement="right">
            <IconButton className={classes.button}>
              <ShowChartIcon />
            </IconButton>
          </Tooltip>
        </ul>
      </li>



    </div>
  )
}