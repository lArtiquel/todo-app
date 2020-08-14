import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, useHistory } from 'react-router-dom'
import { getAuthState, getAuthMessage } from '../store/selectors/authSelector'
import { AuthState } from '../constants/authStates'
import LoadingScreen from './LoadingScreen'
import {
  DefineAuthStateAction,
  ClearErrorMessageAction
} from '../store/actions/authActions'
import Dialog from './KeepInTouchDialog'

const RouteWithProtection = ({
  routeFor,
  children,
  isAuthenticated,
  defineAuthState,
  authDialogMessage,
  closeDialogMessage,
  ...rest
}) => {
  const [body, setBody] = useState(null)
  const history = useHistory()

  const resolveAuthenticatedOnlyRouteBody = () => {
    switch (isAuthenticated) {
      case AuthState.AUTHENTICATED:
        return children
      case AuthState.NOT_AUTHENTICATED:
        history.replace('/login')
        return null
      case AuthState.UNDEFINED:
        defineAuthState()
        return <LoadingScreen />
      default:
        return <LoadingScreen />
    }
  }

  const resolveNotAuthenticatedRouteBody = () => {
    switch (isAuthenticated) {
      case AuthState.AUTHENTICATED:
        history.replace('/')
        return null
      case AuthState.NOT_AUTHENTICATED:
        return children
      case AuthState.UNDEFINED:
        defineAuthState()
        return <LoadingScreen />
      default:
        return <LoadingScreen />
    }
  }

  const resolveRoute = useCallback(() => {
    switch (routeFor) {
      case 'AUTHENTICATED_ONLY':
        return setBody(resolveAuthenticatedOnlyRouteBody())
      case 'NOT_AUTHENTICATED':
        return setBody(resolveNotAuthenticatedRouteBody())
      default:
        return setBody(children)
    }
  }, [routeFor, isAuthenticated])

  useEffect(() => {
    resolveRoute()
  }, [resolveRoute])

  return (
    <Route {...rest}>
      {body}
      {authDialogMessage && (
        <Dialog
          header="Auth information"
          message={authDialogMessage}
          closeCallback={closeDialogMessage}
        />
      )}
    </Route>
  )
}

RouteWithProtection.propTypes = {
  routeFor: PropTypes.oneOf(['AUTHENTICATED_ONLY', 'NOT_AUTHENTICATED']),
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.string.isRequired,
  defineAuthState: PropTypes.func.isRequired,
  authDialogMessage: PropTypes.string.isRequired,
  closeDialogMessage: PropTypes.func.isRequired
}

const mapStateToProps = () => {
  return {
    isAuthenticated: getAuthState(),
    authDialogMessage: getAuthMessage()
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    defineAuthState: () => dispatch(DefineAuthStateAction()),
    closeDialogMessage: () => dispatch(ClearErrorMessageAction())
  }
}

export default connect(mapStateToProps, mapActionsToProps)(RouteWithProtection)
