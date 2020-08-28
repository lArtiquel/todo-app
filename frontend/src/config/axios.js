import axios from 'axios'
import stringify from 'qs-stringify'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { GetAuthAccessToken } from '../store/selectors/Auth'
import { AuthActionTypes, AuthStates } from '../store/constants/Auth'
import store from '../store/store'

const ConfigureAxiosInstance = () => {
  const axiosOptions = {
    baseURL: process.env.REACT_APP_AXIOS_API_BASE_URL,
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // create new axios instance with folowing options
  const axiosInstance = axios.create(axiosOptions)

  // function that will be called to refresh authorization
  const refreshAuthLogic = (failedRequest) =>
    axiosInstance({
      url: '/api/auth/refresh',
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: stringify({
        token: localStorage.getItem(
          process.env.REACT_APP_REFRESH_TOKEN_NAME_IN_LOCAL_STORAGE
        )
      }),
      skipAuthRefresh: true
    })
      .then((tokenRefreshResponse) => {
        // set new tokens (can't do that thru AuthActions, cause it will cause circular dependency bug)
        store.dispatch({
          type: AuthActionTypes.SET_NEW_ACCESS_TOKEN,
          payload: tokenRefreshResponse.data.accessToken
        })
        localStorage.setItem(
          process.env.REACT_APP_REFRESH_TOKEN_NAME_IN_LOCAL_STORAGE,
          tokenRefreshResponse.data.refreshToken
        )
        // eslint-disable-next-line no-param-reassign
        failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.accessToken}`
      })
      .catch(() => {
        // remove refresh token from local storage
        localStorage.removeItem(
          process.env.REACT_APP_REFRESH_TOKEN_NAME_IN_LOCAL_STORAGE
        )
        // change application auth state to NOT_AUTHENTICATED
        store.dispatch({
          type: AuthActionTypes.UPDATE_AUTH_STATE,
          payload: AuthStates.NOT_AUTHENTICATED
        })
      })

  // create auth refresh token interceptor
  createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
    skipWhileRefreshing: true
  }) // while your refresh logic is ran, the instance is marked as "to-be-skipped" in order to prevent the "interceptors loop"

  // use interceptor to inject the token to requests
  axiosInstance.interceptors.request.use((request) => {
    const accessToken = GetAuthAccessToken()
    if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`
    return request
  })

  return axiosInstance
}

export default ConfigureAxiosInstance()
