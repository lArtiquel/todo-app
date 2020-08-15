import React, { useEffect } from 'react'
import { Typography, Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Container from '../../components/Container'
import Header from '../../components/Header'
import Tabs from '../../components/Tabs'
import TransitionAlert from '../../components/TransitionAlert'
import TodoInput from '../../components/TodoInput'
import LoadingScreen from '../../components/LoadingScreen'
import { getLoadingState, getMessage } from '../../store/selectors/taskSelector'
import {
  LoadTodosAction,
  ClearTodosArrayAction,
  ClearErrorMessageAction
} from '../../store/actions/taskActions'
import { LogoutAction } from '../../store/actions/authActions'
import Dialog from '../../components/KeepInTouchDialog'

const TaskPage = ({
  loadTodos,
  clearTodos,
  isLoading,
  todoDialogMessage,
  closeDialogMessage,
  logout
}) => {
  const history = useHistory()

  useEffect(() => {
    loadTodos()

    return () => clearTodos()
  }, [loadTodos, clearTodos]) // load todos once page component mounted and clear todos array when unmounted

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Container>
        <Header
          leftContent={
            <Typography variant="h4">Welcome, dear user!</Typography>
          }
          rightContent={
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => logout(history)}
            >
              Logout
            </Button>
          }
        />
        <TodoInput my={3} />
        <TransitionAlert my={2} content="Task deleted!" />
        <Tabs my={2} />
        {todoDialogMessage && (
          <Dialog
            header="Todo information"
            message={todoDialogMessage}
            closeCallback={closeDialogMessage}
          />
        )}
      </Container>
    </>
  )
}

TaskPage.propTypes = {
  loadTodos: PropTypes.func.isRequired,
  clearTodos: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  todoDialogMessage: PropTypes.string.isRequired,
  closeDialogMessage: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = () => {
  return {
    isLoading: getLoadingState(),
    todoDialogMessage: getMessage()
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    loadTodos: () => dispatch(LoadTodosAction()),
    clearTodos: () => dispatch(ClearTodosArrayAction()),
    closeDialogMessage: () => dispatch(ClearErrorMessageAction()),
    logout: (history) => dispatch(LogoutAction(history))
  }
}

export default connect(mapStateToProps, mapActionsToProps)(TaskPage)
