import stringify from 'qs-stringify'
import { VerifyEmailActions } from '../constants/verifyEmail'
import axios from '../../config/axios'

export const VerifyEmailAction = (urlParams) => {
  return async (dispatch) => {
    // set loading screen and hide dialog if exists
    dispatch({
      type: VerifyEmailActions.SET_DIALOG,
      payload: { isActive: false, header: '', message: '' }
    })
    dispatch({ type: VerifyEmailActions.SET_LOADING_STATE, payload: true })
    // fetch token from url params
    const token = urlParams.get('token')
    if (token) {
      try {
        const response = await axios({
          url: '/api/auth/verify-email',
          method: 'post',
          params: stringify({ token })
        })
        dispatch({
          type: VerifyEmailActions.SET_DIALOG,
          payload: {
            isActive: true,
            header: 'Success',
            message: response.data.message
          }
        })
      } catch (error) {
        dispatch({
          type: VerifyEmailActions.SET_DIALOG,
          payload: {
            isActive: true,
            header: 'Error',
            message: error.data.message
          }
        })
      }
    } else {
      dispatch({
        type: VerifyEmailActions.SET_DIALOG,
        payload: {
          isActive: false,
          header: 'Error',
          message: 'Wrong url provided!'
        }
      })
    }
    // set loading status back to false
    dispatch({ type: VerifyEmailActions.SET_LOADING_STATE, payload: false })
  }
}

export const CloseDialogAction = (history) => {
  return (dispatch) => {
    dispatch({
      type: VerifyEmailActions.SET_DIALOG,
      payload: { isActive: false, header: '', message: '' }
    })
    history.push('/login')
  }
}
