import React, { useState } from 'react'
import { Box, IconButton, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DoneRoundedIcon from '@material-ui/icons/DoneRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  successColor: {
    color: theme.palette.success.main
  },
  warningColor: {
    color: theme.palette.warning.main
  },
  dangerColor: {
    color: theme.palette.error.main
  },
  crossedTextDecoration: {
    textDecoration: 'line-through',
    color: theme.palette.error.main
  }
}))

const Todo = ({ isDone, content }) => {
  const styles = useStyles()
  const [isEditing, setEditing] = useState(false)

  const handleEditChange = () => {
    setEditing(!isEditing)
  }

  return (
    <Box display="flex">
      {isEditing ? (
        <>
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            value={content}
          />
          <IconButton
            aria-label="cancel"
            className={styles.dangerColor}
            onClick={handleEditChange}
          >
            <CloseRoundedIcon />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton aria-label="do" className={styles.successColor}>
            <DoneRoundedIcon />
          </IconButton>
          <Box width="100%" my={2}>
            <Typography
              className={isDone ? styles.crossedTextDecoration : ''}
              variant="body1"
            >
              {content}
            </Typography>
          </Box>
          <IconButton
            aria-label="edit"
            className={styles.warningColor}
            onClick={handleEditChange}
          >
            <EditRoundedIcon />
          </IconButton>
          <IconButton aria-label="delete" className={styles.dangerColor}>
            <DeleteOutlineRoundedIcon />
          </IconButton>
        </>
      )}
    </Box>
  )
}

Todo.propTypes = {
  isDone: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired
}

export default Todo
