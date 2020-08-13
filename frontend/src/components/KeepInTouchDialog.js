import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'

const KeepInTouchDialog = ({ header, message, closeCallback }) => {
  return (
    <>
      <Dialog
        maxWidth="xs"
        fullWidth
        open
        onClose={closeCallback}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">{header}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCallback} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

KeepInTouchDialog.propTypes = {
  header: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  closeCallback: PropTypes.func.isRequired
}

export default KeepInTouchDialog
