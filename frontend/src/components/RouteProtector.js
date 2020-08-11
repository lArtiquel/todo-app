import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAuthState } from '../store/selectors/authSelector'
import { AuthState } from '../constants/authStates'
import LoadingScreen from './LoadingScreen'

const RouteProtector = ({ routeFor, children, isAuthenticated }) => {
  const resolveAuthenticatedOnlyRoute = () => {
    switch (isAuthenticated) {
      case AuthState.AUTHENTICATED:
        return children
      case AuthState.NOT_AUTHENTICATED:
        return <p>Redirect to the login page..</p>
      case AuthState.UNDEFINED:
        // dispatch action to acquire access token
        // and toggle AuthState to one of defined states
        return <LoadingScreen />
      default:
        return <LoadingScreen />
    }
  }

  const resolveNotAuthenticatedRoute = () => {
    switch (isAuthenticated) {
      case AuthState.AUTHENTICATED:
        return <p>Redirect to the home page..</p>
      case AuthState.NOT_AUTHENTICATED:
        return children
      case AuthState.UNDEFINED:
        // dispatch action to acquire access token
        // and toggle AuthState to one of defined states
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
      case 'ANY':
        return children
      default:
        return children
    }
  }

  return <>{resolveRoute()}</>
}

RouteProtector.propTypes = {
  routeFor: PropTypes.oneOf(['AUTHENTICATED_ONLY', 'NOT_AUTHENTICATED', 'ANY']),
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: getAuthState(state)
  }
}

export default connect(mapStateToProps, null)(RouteProtector)
