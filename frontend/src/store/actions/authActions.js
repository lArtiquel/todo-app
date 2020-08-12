import axios from 'axios'
import { AuthActions, AuthNoteName } from '../../constants/auth'
import { AuthState } from '../../constants/authStates'

export const SetNewAccessTokenAction = (response) => {
  return { type: AuthActions.SET_NEW_ACCESS_TOKEN, payload: response.data }
}

export const DefineAuthStateAction = () => {
  return (dispatch) => {
    // try to fetch auth note from local storage
    const isAuthenticated = localStorage.getItem(AuthNoteName)

    if (isAuthenticated) {
      // get new access token
      axios({
        url: 'http://localhost:22222/api/auth/refresh', // refresh token should be in cookies in that time
        method: 'post',
        params: { skipAuthRefresh: true } // don't refresh token if we get 401 error in that request
      })
        .then((response) => {
          dispatch(SetNewAccessTokenAction(response))
        })
        .catch(() => {
          dispatch({
            type: AuthActions.UPDATE_AUTH_STATE,
            payload: AuthState.NOT_AUTHENTICATED
          })
          localStorage.removeItem(AuthNoteName)
        })
    } else {
      dispatch({
        type: AuthActions.UPDATE_AUTH_STATE,
        payload: AuthState.NOT_AUTHENTICATED
      })
    }
  }
}

export const LoginAction = () => {
  return (dispatch) => {
    axios({
      url: 'http://localhost:22222/api/auth/login',
      method: 'post',
      params: { skipAuthRefresh: true }
    })
      .then((response) => {
        dispatch(SetNewAccessTokenAction(response))
        localStorage.setItem(AuthNoteName)
      })
      .catch(() => {
        dispatch({
          type: AuthActions.SET_ERROR_MESSAGE,
          payload: 'Failed to authenticate. Wrong credentials provided.'
        })
      })
  }
}

export const ClearErrorMessageAction = () => {
  return {
    type: AuthActions.SET_ERROR_MESSAGE,
    payload: ''
  }
}
