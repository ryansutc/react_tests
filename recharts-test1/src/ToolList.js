import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOutTwoTone';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import ShowChartIcon from '@material-ui/icons/ShowChart'
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: 'center',
    //padding: "10px"
  },
  ul: {
    listStyleType: 'none',
    paddingLeft: 0,
    paddingInlineStart: 0,
    marginBlockEnd: 0,
    marginBlockStart: 0
  },
  li: {
    marginBottom: '15px',
    [theme.breakpoints.only('xs')]: {
      display: 'inline',
      marginBottom: 0,
      marginRight: '15px'
    }
  },
  button: {
    textAlign: 'center',
    backgroundColor: theme.palette.text.secondary,
  },
}));

export default function(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ul className={classes.ul}>
        <li className={classes.li}>
          <Tooltip title="See next data points" placement="bottom">
            <IconButton className={classes.button} disabled={props.forwardDisabled}
              onClick={props.slideForward}
            >
              <SkipNext />
            </IconButton>
          </Tooltip>
        </li>
        <li className={classes.li}>
          <Tooltip title="See previous data points" placement="bottom">
            <IconButton className={classes.button} disabled={props.backwardDisabled}
              onClick={props.slideBackward}
            >
              <SkipPrevious />
            </IconButton>
          </Tooltip>
        </li>
        <li className={classes.li}>
          <Tooltip title="Go Back to Chart Full Extent" placement="right">
            <IconButton className={classes.button}
              onClick={props.zoomOut}
              disabled={props.zoomOutDisabled}
            >
              <ShowChartIcon />
            </IconButton>
          </Tooltip>
        </li>
      </ul>



    </div>
  )
}