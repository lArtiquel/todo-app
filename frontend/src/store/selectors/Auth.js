import store from '../store'

export const GetAuthState = () => {
  return store.getState().auth.isAuthenticated
}

export const GetAuthAccessToken = () => {
  return store.getState().auth.accessToken
}

export const GetAuthDialog = () => {
  return store.getState().auth.dialog
}

export const GetAuthIsLoading = () => {
  return store.getState().auth.isLoading
}
