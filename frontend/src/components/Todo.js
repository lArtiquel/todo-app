import React from 'react'
import { Box, IconButton, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DoneRoundedIcon from '@material-ui/icons/DoneRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.success.main
  },
  warning: {
    color: theme.palette.warning.main
  },
  danger: {
    color: theme.palette.error.main
  }
}))

const Todo = ({ id, content }) => {
  const styles = useStyles()

  return (
    <Box display="flex">
      <IconButton aria-label="do" className={styles.success}>
        <DoneRoundedIcon />
      </IconButton>
      <TextField variant="outlined" margin="dense" fullWidth value={content} />
      <IconButton
        aria-label="edit"
        color="warning.main"
        className={styles.warning}
      >
        <EditRoundedIcon />
      </IconButton>
      <IconButton
        aria-label="delete"
        color="error.main"
        className={styles.danger}
      >
        <DeleteOutlineRoundedIcon />
      </IconButton>
    </Box>
  )
}

Todo.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string
}

export default Todo
