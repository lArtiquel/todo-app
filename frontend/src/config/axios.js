import axios from 'axios'
import stringify from 'qs-stringify'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { GetAuthAccessToken } from '../store/selectors/Auth'
import {
  SetNewTokensFromResponse,
  DefineAuthState
} from '../store/actions/Auth'
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
        // dispatch action to set new tokens from response
        store.dispatch(SetNewTokensFromResponse())
        // eslint-disable-next-line no-param-reassign
        failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.token}`
        return Promise.resolve()
      })
      .catch(() => {
        // remove refresh token from local storage
        localStorage.removeItem(
          process.env.REACT_APP_REFRESH_TOKEN_NAME_IN_LOCAL_STORAGE
        )
        // dispatch action to define app auth state
        store.dispatch(DefineAuthState())
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
