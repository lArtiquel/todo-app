import store from '../store'

export const getAuthState = () => {
  return store.getState().auth.isAuthenticated
}

export const getAuthAccessToken = () => {
  return store.getState().auth.accessToken
}

export const getAuthMessage = () => {
  return store.getState().auth.message
}
