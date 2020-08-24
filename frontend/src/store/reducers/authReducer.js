import { AuthActions } from '../constants/auth'
import { AuthState } from '../constants/authStates'

const initState = {
  isAuthenticated: AuthState.UNDEFINED,
  isLoading: false,
  message: '',
  accessToken: ''
}

export default function AuthReducer(state = initState, action) {
  switch (action.type) {
    case AuthActions.SET_AUTH_LOADING_STATE: {
      return {
        ...state,
        isLoading: action.payload
      }
    }

    case AuthActions.SET_NEW_ACCESS_TOKEN: {
      return {
        ...state,
        accessToken: action.payload
      }
    }

    case AuthActions.UPDATE_AUTH_STATE: {
      return {
        ...state,
        isAuthenticated: action.payload
      }
    }

    case AuthActions.SET_AUTH_MESSAGE: {
      return {
        ...state,
        message: action.payload
      }
    }

    default:
      return {
        ...state
      }
  }
}
