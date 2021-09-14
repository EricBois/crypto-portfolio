import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

export default function Loader() {
  return (
    <Grid
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
        container
      >
        <Grid item xs={12}>
          <CircularProgress style={{color: '#fff'}} />
        </Grid>
      </Grid>
  )
}
