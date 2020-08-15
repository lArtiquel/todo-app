import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Box, IconButton, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DoneRoundedIcon from '@material-ui/icons/DoneRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  ToggleTodoDoneStateAction,
  EditTodoAction,
  ToggleTodoToBeDeletedStateAction
} from '../store/actions/taskActions'

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

const Todo = ({
  id,
  body,
  done,
  toggleTodoState,
  editTodo,
  toggleTodoToBeDeletedState
}) => {
  const styles = useStyles()
  const [isEditing, setEditing] = useState(false)
  const [newBody, setNewBody] = useState(body)
  const todoRef = useRef()

  const closeEdit = () => {
    setEditing(false)
    setNewBody(body)
  }

  const handleEditTodoChange = (e) => {
    setNewBody(e.target.value)
  }

  const handleEditTodoButtonClick = () => {
    editTodo(id, newBody)
    setEditing(false)
  }

  const editTodoEnterKeyCallback = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        editTodo(id, newBody)
        setEditing(false)
        e.stopPropagation()
      }
    },
    [id, newBody, editTodo]
  )

  useEffect(() => {
    const currentRef = todoRef.current
    if (isEditing && currentRef)
      currentRef.addEventListener('keyup', editTodoEnterKeyCallback)

    return () => {
      if (isEditing && currentRef)
        currentRef.removeEventListener('keyup', editTodoEnterKeyCallback)
    }
  }, [todoRef, isEditing, editTodoEnterKeyCallback])

  return (
    <Box display="flex" ref={todoRef}>
      {isEditing ? (
        <>
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            value={newBody}
            onChange={handleEditTodoChange}
          />
          <IconButton
            aria-label="cancel"
            className={styles.dangerColor}
            onClick={closeEdit}
          >
            <CloseRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="confirmEdit"
            className={styles.successColor}
            onClick={handleEditTodoButtonClick}
          >
            <DoneRoundedIcon />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton
            aria-label="do"
            className={styles.successColor}
            onClick={() => toggleTodoState(id)}
          >
            <DoneRoundedIcon />
          </IconButton>
          <Box width="100%" my={2}>
            <Typography
              className={done ? styles.crossedTextDecoration : ''}
              variant="body1"
            >
              {body}
            </Typography>
          </Box>
          <IconButton
            aria-label="edit"
            className={styles.warningColor}
            onClick={() => setEditing(true)}
          >
            <EditRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            className={styles.dangerColor}
            onClick={() => toggleTodoToBeDeletedState(id)}
          >
            <DeleteOutlineRoundedIcon />
          </IconButton>
        </>
      )}
    </Box>
  )
}

Todo.propTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  done: PropTypes.bool.isRequired,
  toggleTodoState: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
  toggleTodoToBeDeletedState: PropTypes.func.isRequired
}

const mapActionsToProps = (dispatch) => {
  return {
    toggleTodoState: (id) => dispatch(ToggleTodoDoneStateAction(id)),
    editTodo: (id, newBody) => dispatch(EditTodoAction(id, newBody)),
    toggleTodoToBeDeletedState: (id) =>
      dispatch(ToggleTodoToBeDeletedStateAction(id))
  }
}

export default connect(null, mapActionsToProps)(Todo)
