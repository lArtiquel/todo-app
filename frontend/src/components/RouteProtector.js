import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getAuthState, getAuthMessage } from '../store/selectors/authSelector'
import { AuthState } from '../constants/authStates'
import LoadingScreen from './LoadingScreen'
import {
  DefineAuthStateAction,
  ClearErrorMessageAction
} from '../store/actions/authActions'
import Dialog from './KeepInTouchDialog'

const RouteProtector = ({
  routeFor,
  children,
  isAuthenticated,
  defineAuthState,
  authDialogMessage,
  closeDialogMessage
}) => {
  const history = useHistory()

  const resolveAuthenticatedOnlyRoute = () => {
    switch (isAuthenticated) {
      case AuthState.AUTHENTICATED:
        return children
      case AuthState.NOT_AUTHENTICATED:
        return history.replace('/login')
      case AuthState.UNDEFINED:
        defineAuthState()
        return <LoadingScreen />
      default:
        return <LoadingScreen />
    }
  }

  const resolveNotAuthenticatedRoute = () => {
    switch (isAuthenticated) {
      case AuthState.AUTHENTICATED:
        return history.replace('/')
      case AuthState.NOT_AUTHENTICATED:
        return children
      case AuthState.UNDEFINED:
        defineAuthState()
        return <LoadingScreen />
      default:
        return <LoadingScreen />
    }
  }

  const resolveRoute = () => {
    switch (routeFor) {
      case 'AUTHENTICATED_ONLY':
        return resolveAuthenticatedOnlyRoute()
      case 'NOT_AUTHENTICATED':
        return resolveNotAuthenticatedRoute()
      default:
        return children
    }
  }

  return (
    <>
      {resolveRoute()}
      {authDialogMessage && (
        <Dialog
          header="Auth information"
          message={authDialogMessage}
          closeCallback={closeDialogMessage}
        />
      )}
    </>
  )
}

RouteProtector.propTypes = {
  routeFor: PropTypes.oneOf(['AUTHENTICATED_ONLY', 'NOT_AUTHENTICATED']),
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.string.isRequired,
  defineAuthState: PropTypes.func.isRequired,
  authDialogMessage: PropTypes.string.isRequired,
  closeDialogMessage: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: getAuthState(state),
    authDialogMessage: getAuthMessage(state)
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    defineAuthState: () => dispatch(DefineAuthStateAction()),
    closeDialogMessage: () => dispatch(ClearErrorMessageAction())
  }
}

export default connect(mapStateToProps, mapActionsToProps)(RouteProtector)
