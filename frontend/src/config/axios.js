import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { AuthActions } from '../constants/auth'
import { getAuthAccessToken } from '../store/selectors/authSelector'
import store from '../store/store'

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest) =>
  axios
    .post('http://localhost:22222/api/auth/refresh')
    .then((tokenRefreshResponse) => {
      // Directly dispatch action to mutate the state
      store.dispatch({
        type: AuthActions.SET_NEW_ACCESS_TOKEN,
        payload: tokenRefreshResponse.data
      })
      // eslint-disable-next-line no-param-reassign
      failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.token}`
      return Promise.resolve()
    })

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(axios, refreshAuthLogic)

// Use interceptor to inject the token to requests
axios.interceptors.request.use((request) => {
  request.headers.Authorization = `Bearer ${getAuthAccessToken()}`
  return request
})
