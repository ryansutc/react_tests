import React from 'react';

import { Paper, Typography } from '@material-ui/core';

export default function StatsForm(props) {
  const { selectionStats } = props;

  if (!selectionStats) return null;

  return (
    <div style={{
      width: '300px', padding: '10px', backgroundColor: 'white',
      position: "absolute", right: 30, top: 30
    }}>
      <Paper>
        <Typography variant='subtitle'>
          Selection Stats
        </Typography>
        <Typography component="p">
          Min: {selectionStats.min}
        </Typography>
        <Typography component="p">
          Max: {selectionStats.max}
        </Typography>
        <Typography component="p">
          Avg: {selectionStats.avg}
        </Typography>
        <Typography component="p">
          Count: {selectionStats.count}
        </Typography>
      </Paper>
    </div>
  )
}