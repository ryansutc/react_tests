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
    //backgroundColor: "orange",
    textAlign: 'center',
    backgroundColor: theme.palette.text.secondary,
  },
}));

export default function() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ul className={classes.ul}>
        <li className={classes.li}>
          <Tooltip title="Zoom In on Chart" placement="right">
            <IconButton className={classes.button}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
        </li>
        <li className={classes.li}>
          <Tooltip title="Zoom Out to Full Extent" placement="right">
            <IconButton className={classes.button}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
        </li>
        <li className={classes.li}>
          <Tooltip title="Go Back to Chart Full Extent" placement="right">
            <IconButton className={classes.button}>
              <ShowChartIcon />
            </IconButton>
          </Tooltip>
        </li>
      </ul>



    </div>
  )
}