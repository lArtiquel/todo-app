import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  background: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    zIndex: 999,
    backgroundColor: '#4240606e'
  }
}))

export default function LoadingScreen() {
  const styles = useStyles()

  return (
    <div className={styles.background}>
      <CircularProgress />
    </div>
  )
}
