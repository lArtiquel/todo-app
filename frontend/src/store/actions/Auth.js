import stringify from 'qs-stringify'
import { AuthActionTypes, AuthStates } from '../constants/Auth'
import axios from '../../config/Axios'

const refreshTokenName =
  process.env.REACT_APP_REFRESH_TOKEN_NAME_IN_LOCAL_STORAGE

export const SetNewTokensFromResponse = (response) => {
  // save refresh token in local storage
  localStorage.setItem(refreshTokenName, response.data.refreshToken)
  // save access token in app memory (global state)
  return {
    type: AuthActionTypes.SET_NEW_ACCESS_TOKEN,
    payload: response.data.accessToken
  }
}

export const DefineAuthState = () => {
  return async (dispatch) => {
    // fetch refresh token from localStorage
    const refreshToken = localStorage.getItem(refreshTokenName)

    if (refreshToken) {
      try {
        // get new tokens
        const response = axios({
          url: '/api/auth/refresh', // refresh token should be in cookies in that time
          method: 'post',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: stringify({ token: refreshToken }),
          skipAuthRefresh: true // don't refresh token if we get 401 error
        })
        // set tokens from response
        dispatch(SetNewTokensFromResponse(response))
        // set auth state to NOT_AUTHENTICATED
        dispatch({
          type: AuthActionTypes.UPDATE_AUTH_STATE,
          payload: AuthStates.AUTHENTICATED
        })
      } catch (error) {
        // remove refresh token from localStorage
        localStorage.removeItem(refreshTokenName)
        // set auth state to NOT_AUTHENTICATED
        dispatch({
          type: AuthActionTypes.UPDATE_AUTH_STATE,
          payload: AuthStates.NOT_AUTHENTICATED
        })
      }
    } else {
      dispatch({
        type: AuthActionTypes.UPDATE_AUTH_STATE,
        payload: AuthStates.NOT_AUTHENTICATED
      })
    }
  }
}

export const Login = ({ form }) => {
  return async (dispatch) => {
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: true })
    try {
      const response = await axios({
        url: '/api/auth/login',
        method: 'post',
        data: form,
        skipAuthRefresh: true // don't refresh token if we get 401 error
      })
      // set tokens from response
      dispatch(SetNewTokensFromResponse(response))
      // set AUTHENTICATED state
      dispatch({
        type: AuthActionTypes.UPDATE_AUTH_STATE,
        payload: AuthStates.AUTHENTICATED
      })
    } catch (error) {
      dispatch({
        type: AuthActionTypes.SET_MESSAGE_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: error.response
            ? error.response.data.message || 'Failed to login!'
            : 'No response received... Check your internet connection!'
        }
      })
    }
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const Logout = ({ history }) => {
  return async (dispatch) => {
    try {
      await axios({
        url: '/api/auth/logout',
        method: 'post',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: stringify({ token: localStorage.getItem(refreshTokenName) })
      })
    } finally {
      // remove access and refresh tokens on the client side
      dispatch({
        type: AuthActionTypes.SET_NEW_ACCESS_TOKEN,
        payload: { accessToken: '' }
      })
      localStorage.removeItem(refreshTokenName)
      // set NOT_AUTHENTICATED state
      dispatch({
        type: AuthActionTypes.UPDATE_AUTH_STATE,
        payload: AuthStates.NOT_AUTHENTICATED
      })
      // redirect back to the login route
      history.push('/login')
    }
  }
}

export const Register = ({ registerForm, history }) => {
  return async (dispatch) => {
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: true })
    try {
      const response = await axios({
        url: '/api/auth/register',
        method: 'post',
        data: registerForm,
        skipAuthRefresh: true // don't refresh token if we get 401 error
      })
      // display message about successful registration
      dispatch({
        type: AuthActionTypes.SET_MESSAGE_DIALOG,
        payload: {
          isActive: true,
          header: 'Success',
          message: response.data.message,
          customOnCloseAction: () => history.push('/login')
        }
      })
    } catch (error) {
      dispatch({
        type: AuthActionTypes.SET_MESSAGE_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: error.response
            ? error.response.data.message || 'Failed to register!'
            : 'No response received... Check your internet connection!'
        }
      })
    }
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const VerifyEmailOrCancelAccount = ({ location, cancel, history }) => {
  return async (dispatch) => {
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: true })
    const urlParams = new URLSearchParams(location.search)
    // fetch token from url params
    const token = urlParams.get('token')
    if (token) {
      try {
        const response = await axios({
          url: `/api/auth/${cancel ? 'cancel-account' : 'verify-email'}`,
          method: 'post',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: stringify({ token }),
          skipAuthRefresh: true
        })
        dispatch({
          type: AuthActionTypes.SET_MESSAGE_DIALOG,
          payload: {
            isActive: true,
            header: 'Success',
            message: response.data.message,
            customOnCloseAction: () => history.replace('/login')
          }
        })
      } catch (error) {
        dispatch({
          type: AuthActionTypes.SET_MESSAGE_DIALOG,
          payload: {
            isActive: true,
            header: 'Error',
            message: error.response
              ? error.response.data.message ||
                `Failed to ${
                  cancel ? 'cancel account with that email' : 'verify email'
                }!`
              : 'No response received... Check your internet connection!',
            customOnCloseAction: () => history.replace('/login')
          }
        })
      }
    } else {
      dispatch({
        type: AuthActionTypes.SET_MESSAGE_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: 'Wrong url provided!',
          customOnCloseAction: () => history.replace('/login')
        }
      })
    }
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const ResetPasswordForEmail = ({ email }) => {
  return async (dispatch) => {
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: true })
    try {
      const response = await axios({
        url: '/api/auth/reset-password-for-email',
        method: 'post',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: stringify({ email }),
        skipAuthRefresh: true
      })
      dispatch({
        type: AuthActionTypes.SET_MESSAGE_DIALOG,
        payload: {
          isActive: true,
          header: 'Success',
          message: response.data.message
        }
      })
    } catch (error) {
      dispatch({
        type: AuthActionTypes.SET_MESSAGE_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: error.response
            ? error.response.data.message ||
              'Failed to perform reset password operation for that email!'
            : 'No response received... Check your internet connection!'
        }
      })
    }
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const ResetPassword = ({ location, newPassword, history }) => {
  return async (dispatch) => {
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: true })
    const urlParams = new URLSearchParams(location.search)
    const token = urlParams.get('token')
    if (token) {
      try {
        const response = await axios({
          url: '/api/auth/reset-password',
          method: 'post',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: stringify({ token, newPassword }),
          skipAuthRefresh: true
        })
        dispatch({
          type: AuthActionTypes.SET_MESSAGE_DIALOG,
          payload: {
            isActive: true,
            header: 'Success',
            message: response.data.message,
            customOnCloseAction: () => history.replace('/login')
          }
        })
      } catch (error) {
        dispatch({
          type: AuthActionTypes.SET_MESSAGE_DIALOG,
          payload: {
            isActive: true,
            header: 'Error',
            message: error.response
              ? error.response.data.message || 'Failed to reset password!'
              : 'No response received... Check your internet connection!',
            customOnCloseAction: () => history.replace('/login')
          }
        })
      }
    }
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const CancelPasswordReset = ({ history, location }) => {
  return async (dispatch) => {
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: true })
    const urlParams = new URLSearchParams(location.search)
    // fetch token from url params
    const token = urlParams.get('token')
    if (token) {
      try {
        const response = await axios({
          url: `/api/auth/cancel-password-reset`,
          method: 'post',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: stringify({ token }),
          skipAuthRefresh: true
        })
        dispatch({
          type: AuthActionTypes.SET_MESSAGE_DIALOG,
          payload: {
            isActive: true,
            header: 'Success',
            message: response.data.message,
            customOnCloseAction: () => history.replace('/login')
          }
        })
      } catch (error) {
        dispatch({
          type: AuthActionTypes.SET_MESSAGE_DIALOG,
          payload: {
            isActive: true,
            header: 'Error',
            message: error.response
              ? error.response.data.message ||
                'Failed to cancel password reset!'
              : 'No response received... Check your internet connection!',
            customOnCloseAction: () => history.replace('/login')
          }
        })
      }
    } else {
      dispatch({
        type: AuthActionTypes.SET_MESSAGE_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: 'Wrong url provided!',
          customOnCloseAction: () => history.replace('/login')
        }
      })
    }
    dispatch({ type: AuthActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const CloseDialog = () => {
  return {
    type: AuthActionTypes.SET_MESSAGE_DIALOG,
    payload: {
      isActive: false,
      header: '',
      message: ''
    }
  }
}
