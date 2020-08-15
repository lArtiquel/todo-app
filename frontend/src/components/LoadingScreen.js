import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress, Backdrop } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1
  }
}))

const LoadingScreen = ({ open, handleClose }) => {
  const styles = useStyles()

  return (
    <Backdrop
      className={styles.backdrop}
      open={open || true}
      onClick={handleClose}
    >
      <CircularProgress />
    </Backdrop>
  )
}

LoadingScreen.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}

export default LoadingScreen
