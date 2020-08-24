import stringify from 'qs-stringify'
import { AuthActions } from '../constants/auth'
import { AuthState } from '../constants/authStates'
import axios from '../../config/axios'

const refreshTokenName =
  process.env.REACT_APP_REFRESH_TOKEN_NAME_IN_LOCAL_STORAGE

export const SetNewTokensFromResponseAction = (response) => {
  // save refresh token in local storage
  localStorage.setItem(refreshTokenName, response.data.refreshToken)
  // save access token in app memory (global state)
  return {
    type: AuthActions.SET_NEW_ACCESS_TOKEN,
    payload: response.data.accessToken
  }
}

export const DefineAuthStateAction = () => {
  return (dispatch) => {
    // fetch refresh token from localStorage
    const refreshToken = localStorage.getItem(refreshTokenName)

    if (refreshToken) {
      // get new tokens
      axios({
        url: '/api/auth/refresh', // refresh token should be in cookies in that time
        method: 'post',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: stringify({ token: refreshToken }),
        skipAuthRefresh: true // don't refresh token if we get 401 error
      })
        .then((response) => {
          // set tokens from response
          dispatch(SetNewTokensFromResponseAction(response))
          // set auth state to NOT_AUTHENTICATED
          dispatch({
            type: AuthActions.UPDATE_AUTH_STATE,
            payload: AuthState.AUTHENTICATED
          })
        })
        .catch(() => {
          // remove refresh token from localStorage
          localStorage.removeItem(refreshTokenName)
          // set auth state to NOT_AUTHENTICATED
          dispatch({
            type: AuthActions.UPDATE_AUTH_STATE,
            payload: AuthState.NOT_AUTHENTICATED
          })
        })
    } else {
      dispatch({
        type: AuthActions.UPDATE_AUTH_STATE,
        payload: AuthState.NOT_AUTHENTICATED
      })
    }
  }
}

export const LoginAction = (loginForm) => {
  return (dispatch) => {
    dispatch({ type: AuthActions.SET_AUTH_LOADING_STATE, payload: true })
    axios({
      url: '/api/auth/login',
      method: 'post',
      data: loginForm,
      skipAuthRefresh: true // don't refresh token if we get 401 error
    })
      .then((response) => {
        // set tokens from response
        dispatch(SetNewTokensFromResponseAction(response))
        // set AUTHENTICATED state
        dispatch({
          type: AuthActions.UPDATE_AUTH_STATE,
          payload: AuthState.AUTHENTICATED
        })
      })
      .catch((error) => {
        dispatch({
          type: AuthActions.SET_AUTH_MESSAGE,
          payload:
            error.response.data.message || 'Failed to login! Try again later.'
        })
      })
      .finally(() => {
        dispatch({ type: AuthActions.SET_AUTH_LOADING_STATE, payload: false })
      })
  }
}

export const LogoutAction = (history) => {
  return (dispatch) => {
    axios({
      url: '/api/auth/logout',
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: stringify({ token: localStorage.getItem(refreshTokenName) })
    }).finally((_) => {
      // remove access and refresh tokens on the client side
      dispatch({
        type: AuthActions.SET_NEW_ACCESS_TOKEN,
        payload: { accessToken: '' }
      })
      localStorage.removeItem(refreshTokenName)
      // set NOT_AUTHENTICATED state
      dispatch({
        type: AuthActions.UPDATE_AUTH_STATE,
        payload: AuthState.NOT_AUTHENTICATED
      })
      // redirect back to the login route
      history.push('/login')
    })
  }
}

export const RegisterAction = ({ registerForm, history }) => {
  return (dispatch) => {
    dispatch({ type: AuthActions.SET_AUTH_LOADING_STATE, payload: true })
    axios({
      url: '/api/auth/register',
      method: 'post',
      data: registerForm,
      skipAuthRefresh: true // don't refresh token if we get 401 error
    })
      .then((response) => {
        // display message about successful registration
        dispatch({
          type: AuthActions.SET_AUTH_MESSAGE,
          payload: response.data.message
        })
        // redirect to the login route
        history.push('/login')
      })
      .catch((error) => {
        dispatch({
          type: AuthActions.SET_AUTH_MESSAGE,
          payload:
            error.response.data.message ||
            'Failed to authenticate. Try again later.'
        })
      })
      .finally(() => {
        dispatch({ type: AuthActions.SET_AUTH_LOADING_STATE, payload: false })
      })
  }
}

export const ClearErrorMessageAction = () => {
  return {
    type: AuthActions.SET_AUTH_MESSAGE,
    payload: ''
  }
}
