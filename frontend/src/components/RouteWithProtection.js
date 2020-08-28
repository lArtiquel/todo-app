import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, useHistory } from 'react-router-dom'
import { GetAuthState } from '../store/selectors/Auth'
import { AuthStates } from '../store/constants/Auth'
import LoadingScreen from './LoadingScreen'
import { DefineAuthState } from '../store/actions/Auth'

const RouteWithProtection = ({
  routeFor,
  children,
  isAuthenticated,
  defineAuthState,
  ...rest
}) => {
  const [body, setBody] = useState(null)
  const history = useHistory()

  const resolveAuthenticatedOnlyRouteBody = useCallback(() => {
    switch (isAuthenticated) {
      case AuthStates.AUTHENTICATED:
        return children
      case AuthStates.NOT_AUTHENTICATED:
        history.replace('/login')
        return null
      case AuthStates.UNDEFINED:
        defineAuthState()
        return <LoadingScreen />
      default:
        return <LoadingScreen />
    }
  }, [children, defineAuthState, history, isAuthenticated])

  const resolveNotAuthenticatedRouteBody = useCallback(() => {
    switch (isAuthenticated) {
      case AuthStates.AUTHENTICATED:
        history.replace('/')
        return null
      case AuthStates.NOT_AUTHENTICATED:
        return children
      case AuthStates.UNDEFINED:
        defineAuthState()
        return <LoadingScreen />
      default:
        return <LoadingScreen />
    }
  }, [children, defineAuthState, history, isAuthenticated])

  const resolveRoute = useCallback(() => {
    switch (routeFor) {
      case 'AUTHENTICATED_ONLY':
        return setBody(resolveAuthenticatedOnlyRouteBody())
      case 'NOT_AUTHENTICATED':
        return setBody(resolveNotAuthenticatedRouteBody())
      default:
        return setBody(children)
    }
  }, [
    routeFor,
    resolveAuthenticatedOnlyRouteBody,
    resolveNotAuthenticatedRouteBody,
    children
  ])

  useEffect(() => {
    resolveRoute()
  }, [resolveRoute])

  return <Route {...rest}>{body}</Route>
}

RouteWithProtection.propTypes = {
  routeFor: PropTypes.oneOf(['AUTHENTICATED_ONLY', 'NOT_AUTHENTICATED']),
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.string.isRequired,
  defineAuthState: PropTypes.func.isRequired
}

const mapStateToProps = () => {
  return {
    isAuthenticated: GetAuthState()
  }
}

const actionCreators = {
  defineAuthState: DefineAuthState
}

export default connect(mapStateToProps, actionCreators)(RouteWithProtection)
