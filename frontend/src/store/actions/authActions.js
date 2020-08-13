import axios from 'axios'
import { useHistory } from 'react-router-dom'
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
          // set new acess token issued by server
          dispatch(SetNewAccessTokenAction(response))
        })
        .catch(() => {
          // set auth state to NOT_AUTHENTICATED
          dispatch({
            type: AuthActions.UPDATE_AUTH_STATE,
            payload: AuthState.NOT_AUTHENTICATED
          })
          // remove auth note, so in the future app won't try to regain access token with that refresh token
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

export const LoginAction = (loginForm) => {
  return (dispatch) => {
    axios({
      url: 'http://localhost:22222/api/auth/login',
      method: 'post',
      params: { skipAuthRefresh: true },
      data: loginForm
    })
      .then((response) => {
        // set AUTHENTICATED state
        dispatch({
          type: AuthActions.UPDATE_AUTH_STATE,
          payload: AuthState.AUTHENTICATED
        })
        // set note that user authenticated
        // it'll help to identify auth state when user lost his access token and need to regain it
        // user losts his access token every time when closes app
        localStorage.setItem(AuthNoteName)
      })
      .catch(() => {
        dispatch({
          type: AuthActions.SET_MESSAGE,
          payload: 'Failed to authenticate.'
        })
      })
  }
}

export const LogoutAction = () => {
  const history = useHistory()
  return (dispatch) => {
    axios({
      url: 'http://localhost:22222/api/auth/logout',
      method: 'post',
      params: { skipAuthRefresh: true }
    }).finally((response) => {
      // remove access token on client
      dispatch({
        type: AuthActions.SET_NEW_ACCESS_TOKEN,
        payload: { accessToken: '' }
      })
      // set NOT_AUTHENTICATED state
      dispatch({
        type: AuthActions.UPDATE_AUTH_STATE,
        payload: AuthState.NOT_AUTHENTICATED
      })
      // remove auth note so app won't be trying to refresh token on reload
      localStorage.removeItem(AuthNoteName)
      // redirect back to the login route
      history.push('/login')
    })
  }
}

export const RegisterAction = () => {
  const history = useHistory()

  return (dispatch) => {
    axios({
      url: 'http://localhost:22222/api/auth/register',
      method: 'post',
      params: { skipAuthRefresh: true }
    })
      .then((response) => {
        // display message about successful registration
        dispatch({
          type: AuthActions.SET_MESSAGE,
          payload: 'Successfully registered! Now try to login.'
        })
        // redirect to the login route
        history.push('/login')
      })
      .catch((error) => {
        dispatch({
          type: AuthActions.SET_MESSAGE,
          payload: error.message
        })
      })
  }
}

export const ClearErrorMessageAction = () => {
  return {
    type: AuthActions.SET_MESSAGE,
    payload: ''
  }
}
