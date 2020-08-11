import { AuthActions } from '../../constants/actions'
import { AuthState } from '../../constants/authStates'

const initState = {
  isAuthenticated: AuthState.UNDEFINED,
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
