import { AuthActions } from '../../constants/actions'

const initState = {
  isAutthenticated: false,
  accessToken: '',
  accessTokenExpiryDate: ''
}

export default function AuthReducer(state = initState, action) {
  switch (action.type) {
    default:
      return {
        ...state
      }
  }
}
