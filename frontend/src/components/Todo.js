import React, { useState, useEffect } from 'react'
import { Box, IconButton, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DoneRoundedIcon from '@material-ui/icons/DoneRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  ToggleTodoStateAction,
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
  isDone,
  content,
  toggleTodoState,
  editTodo,
  toggleTodoToBeDeletedState
}) => {
  const styles = useStyles()
  const [isEditing, setEditing] = useState(false)
  const [todoContent, setTodoContent] = useState(content)

  const onCloseEdit = () => {
    setEditing(false)
    setTodoContent(content)
  }

  const onEditTodo = () => {
    setEditing(false)
    editTodo(id, todoContent)
  }

  const onEditTodoEvent = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      setEditing(false)
      editTodo(id, todoContent)
    }
  }

  useEffect(() => {
    if (isEditing) {
      // check key
      window.addEventListener('keyup', onEditTodoEvent)
    } else {
      window.removeEventListener('keyup', onEditTodoEvent)
    }
    return () => window.removeEventListener('keyup', onEditTodoEvent)
  }, [isEditing])

  return (
    <Box display="flex">
      {isEditing ? (
        <>
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            value={todoContent}
            onChange={(e) => setTodoContent(e.target.value)}
          />
          <IconButton
            aria-label="cancel"
            className={styles.dangerColor}
            onClick={onCloseEdit}
          >
            <CloseRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="confirmEdit"
            className={styles.successColor}
            onClick={onEditTodo}
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
              className={isDone ? styles.crossedTextDecoration : ''}
              variant="body1"
            >
              {content}
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
  isDone: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  toggleTodoState: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
  toggleTodoToBeDeletedState: PropTypes.func.isRequired
}

const mapActionToProps = (dispatch) => {
  return {
    toggleTodoState: (id) => dispatch(ToggleTodoStateAction(id)),
    editTodo: (id, newTodoContent) =>
      dispatch(EditTodoAction(id, newTodoContent)),
    toggleTodoToBeDeletedState: (todoId) =>
      dispatch(ToggleTodoToBeDeletedStateAction(todoId))
  }
}

export default connect(null, mapActionToProps)(Todo)
