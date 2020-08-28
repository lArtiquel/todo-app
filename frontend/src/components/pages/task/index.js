import React, { useEffect } from 'react'
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Header from '../../Header'
import TodoTabs from './TodoTabs'
import TodoTransitionAlert from './TodoTransitionAlert'
import TodoInput from './TodoInput'
import {
  GetTaskLoadingState,
  GetTaskDialog
} from '../../../store/selectors/Task'
import {
  LoadTodos,
  ClearTodosArray,
  CloseDialog
} from '../../../store/actions/Task'
import { Logout } from '../../../store/actions/Auth'
import Logo from '../../Logo'
import PageTemplate from '../../PageTemplate'

const TaskPage = ({ loadTodos, clearTodos, logout, isLoading, dialog }) => {
  const history = useHistory()

  useEffect(() => {
    loadTodos()

    return () => clearTodos()
  }, [loadTodos, clearTodos])

  return (
    <PageTemplate
      REDUX_isPageLoading={isLoading}
      REDUX_pageDialog={dialog}
      PageHeader={
        <Header
          leftContent={<Logo />}
          rightContent={
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => logout({ history })}
            >
              Logout
            </Button>
          }
        />
      }
      PageContent={
        <>
          <TodoInput my={3} />
          <TodoTransitionAlert my={2} content="Task deleted!" />
          <TodoTabs my={2} />
        </>
      }
    />
  )
}

TaskPage.propTypes = {
  loadTodos: PropTypes.func.isRequired,
  clearTodos: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  dialog: PropTypes.object.isRequired
}

const mapStateToProps = () => {
  return {
    isLoading: GetTaskLoadingState(),
    dialog: GetTaskDialog()
  }
}

const actionCreators = {
  loadTodos: LoadTodos,
  clearTodos: ClearTodosArray,
  closeDialog: CloseDialog,
  logout: Logout
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    dialog: {
      ...stateProps.dialog,
      closeCallback: dispatchProps.closeDialog
    }
  }
}

export default connect(mapStateToProps, actionCreators, mergeProps)(TaskPage)
