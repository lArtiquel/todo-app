import React, { useState, useEffect } from 'react'
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
  const [body, setBody] = useState(null)

  const resolveAuthenticatedOnlyRouteBody = () => {
    switch (isAuthenticated) {
      case AuthState.AUTHENTICATED:
        setBody(children)
        break
      case AuthState.NOT_AUTHENTICATED:
        history.replace('/login')
        break
      case AuthState.UNDEFINED:
        defineAuthState()
        setBody(<LoadingScreen />)
        break
      default:
        setBody(<LoadingScreen />)
    }
  }

  const resolveNotAuthenticatedRouteBody = () => {
    switch (isAuthenticated) {
      case AuthState.AUTHENTICATED:
        history.replace('/')
        break
      case AuthState.NOT_AUTHENTICATED:
        setBody(children)
        break
      case AuthState.UNDEFINED:
        defineAuthState()
        setBody(<LoadingScreen />)
        break
      default:
        setBody(<LoadingScreen />)
    }
  }

  const resolveRoute = () => {
    switch (routeFor) {
      case 'AUTHENTICATED_ONLY':
        return resolveAuthenticatedOnlyRouteBody()
      case 'NOT_AUTHENTICATED':
        return resolveNotAuthenticatedRouteBody()
      default:
        return children
    }
  }

  useEffect(() => {
    resolveRoute()
  }, [routeFor, isAuthenticated])

  return (
    <>
      {body}
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
