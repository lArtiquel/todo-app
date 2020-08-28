import { AuthActionTypes, AuthStates } from '../constants/Auth'

const initState = {
  isAuthenticated: AuthStates.UNDEFINED,
  isLoading: false,
  dialog: {
    isActive: false,
    header: '',
    message: '',
    customOnCloseAction: null
  },
  accessToken: ''
}

export default function AuthReducer(state = initState, action) {
  switch (action.type) {
    case AuthActionTypes.SET_LOADING_STATE: {
      return {
        ...state,
        isLoading: action.payload
      }
    }

    case AuthActionTypes.SET_NEW_ACCESS_TOKEN: {
      return {
        ...state,
        accessToken: action.payload
      }
    }

    case AuthActionTypes.UPDATE_AUTH_STATE: {
      return {
        ...state,
        isAuthenticated: action.payload
      }
    }

    case AuthActionTypes.SET_MESSAGE_DIALOG: {
      return {
        ...state,
        dialog: action.payload
      }
    }

    default:
      return {
        ...state
      }
  }
}
