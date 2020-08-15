import React, { useState, useEffect } from 'react'
import Alert from '@material-ui/lab/Alert'
import { Button, Box } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getDeletedTodoId } from '../store/selectors/taskSelector'
import {
  ToggleTodoToBeDeletedStateAction,
  DeleteTodoPermanentlyAction
} from '../store/actions/taskActions'

const TransitionAlert = ({
  my,
  content,
  lastDeletedTodoId,
  toggleTodoToBeDeletedState,
  deletePermanently
}) => {
  const [open, setOpen] = useState(true)
  const [timerId, setTimerId] = useState()

  const handleUndoClick = () => {
    toggleTodoToBeDeletedState(lastDeletedTodoId)
    clearTimeout(timerId)
    setOpen(false)
  }

  useEffect(() => {
    if (lastDeletedTodoId) {
      setOpen(true)
      setTimerId(
        setTimeout(() => {
          // this will work cause func remembers `lastDeletedTodoId` that was in the scope at the creation time
          deletePermanently(lastDeletedTodoId)
        }, 5000)
      )
    } else {
      setOpen(false)
    }
  }, [deletePermanently, lastDeletedTodoId])

  return (
    <Box my={my}>
      <Collapse in={open}>
        <Alert
          action={
            <Button color="inherit" size="small" onClick={handleUndoClick}>
              UNDO
            </Button>
          }
        >
          {content}
        </Alert>
      </Collapse>
    </Box>
  )
}

TransitionAlert.propTypes = {
  my: PropTypes.number,
  content: PropTypes.string.isRequired,
  lastDeletedTodoId: PropTypes.string.isRequired,
  toggleTodoToBeDeletedState: PropTypes.func.isRequired,
  deletePermanently: PropTypes.func.isRequired
}

const mapStateToProps = () => {
  return {
    lastDeletedTodoId: getDeletedTodoId()
  }
}

const mapActionToProps = (dispatch) => {
  return {
    toggleTodoToBeDeletedState: (id) =>
      dispatch(ToggleTodoToBeDeletedStateAction(id)),
    deletePermanently: (id) => dispatch(DeleteTodoPermanentlyAction(id))
  }
}

export default connect(mapStateToProps, mapActionToProps)(TransitionAlert)
