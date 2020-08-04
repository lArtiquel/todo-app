import React, { useState, useEffect } from 'react'
import Alert from '@material-ui/lab/Alert'
import { Button } from '@material-ui/core/'
import Collapse from '@material-ui/core/Collapse'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getDeletedTodoId } from '../store/selectors/taskSelector'
import {
  ToggleTodoToBeDeletedStateAction,
  DeleteTodoPermanentlyAction
} from '../store/actions/taskActions'

const TransitionAlert = ({
  content,
  lastDeletedTodoId,
  toggleTodoToBeDeletedState,
  deletePermanently
}) => {
  const [open, setOpen] = useState(true)
  const [timerId, setTimerId] = useState()

  const clearTimer = () => {
    clearTimeout(timerId)
  }

  useEffect(() => {
    if (lastDeletedTodoId) {
      setOpen(true)
      setTimerId(
        // eslint-disable-next-line no-shadow
        setTimeout((lastDeletedTodoId) => {
          deletePermanently(lastDeletedTodoId)
        }, 5000)
      )
    } else {
      setOpen(false)
    }
    return () => clearTimer()
  }, [lastDeletedTodoId])

  return (
    <Collapse in={open}>
      <Alert
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              toggleTodoToBeDeletedState(lastDeletedTodoId)
            }}
          >
            UNDO
          </Button>
        }
      >
        {content}
      </Alert>
    </Collapse>
  )
}

TransitionAlert.propTypes = {
  content: PropTypes.string.isRequired,
  lastDeletedTodoId: PropTypes.string.isRequired,
  toggleTodoToBeDeletedState: PropTypes.func.isRequired,
  deletePermanently: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    lastDeletedTodoId: getDeletedTodoId(state)
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
