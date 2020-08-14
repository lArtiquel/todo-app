import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { AuthActions } from '../constants/auth'
import { getAuthAccessToken } from '../store/selectors/authSelector'
import store from '../store/store'

const myAxios = () => {
  const axiosOptions = {
    baseURL: 'http://localhost:22222',
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // create new axios instance with folowing options
  const axiosInstance = axios.create(axiosOptions)

  // function that will be called to refresh authorization
  const refreshAuthLogic = (failedRequest) =>
    axiosInstance
      .post('/api/auth/refresh', { skipAuthRefresh: true })
      .then((tokenRefreshResponse) => {
        // directly dispatch action to mutate the state
        store.dispatch({
          type: AuthActions.SET_NEW_ACCESS_TOKEN,
          payload: tokenRefreshResponse.data
        })
        // eslint-disable-next-line no-param-reassign
        failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.token}`
        return Promise.resolve()
      })

  // create auth refresh token interceptor
  createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
    skipWhileRefreshing: true
  }) // while your refresh logic is ran, the instance is marked as "to-be-skipped" in order to prevent the "interceptors loop"

  // use interceptor to inject the token to requests
  axiosInstance.interceptors.request.use((request) => {
    const accessToken = getAuthAccessToken()
    if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`
    return request
  })

  return axiosInstance
}

export default myAxios()
