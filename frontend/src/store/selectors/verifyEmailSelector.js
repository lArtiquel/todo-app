import store from '../store'

export const getLoadingState = () => {
  return store.getState().verifyEmail.isLoading
}

export const getDialog = () => {
  return store.getState().verifyEmail.dialog
}
