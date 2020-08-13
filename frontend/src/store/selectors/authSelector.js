export const getAuthState = (state) => {
  return state.auth.isAuthenticated
}

export const getAuthAccessToken = (state) => {
  return state.auth.accessToken
}

export const getAuthMessage = (state) => {
  return state.auth.message
}
