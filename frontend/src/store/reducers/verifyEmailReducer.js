import { VerifyEmailActions } from '../constants/verifyEmail'

const initState = {
  isLoading: true,
  dialog: {
    isActive: false,
    header: '',
    message: ''
  }
}

export default function VerifyEmailReducer(state = initState, action) {
  switch (action.type) {
    case VerifyEmailActions.SET_LOADING_STATE: {
      return {
        ...state,
        isLoading: action.payload
      }
    }

    case VerifyEmailActions.SET_DIALOG: {
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
