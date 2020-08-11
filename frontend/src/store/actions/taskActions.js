import axios from 'axios'
import { TaskActions } from '../../constants/actions'
import { getAuthAccessToken } from '../selectors/authSelector'

export const LoadTodosAction = () => {
  return (dispatch, getState) => {
    // first of all toggle isLoading var to display loading screen
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: true })
    // make axios call to fetch all todos from server
    axios({
      url: 'http://localhost:22222/api/todos',
      method: 'get',
      headers: [{ Authorization: `Bearer ${getAuthAccessToken(getState())}` }]
    })
      .then((response) => {
        // push todos into state
        dispatch({
          type: TaskActions.SET_IS_LOADING_STATE,
          payload: response.data
        })
      })
      .catch((error) => {
        // set request error
        dispatch({
          type: TaskActions.SET_ERROR_MESSAGE,
          payload: error.message
        })
      })
    // set isLoading var in state back to false
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: false })
  }
}

export const AddTodoAction = (body) => {
  return (dispatch, getState) => {
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: true })
    // add todo on server
    axios({
      url: 'http://localhost:22222/api/todos',
      method: 'post',
      headers: [{ Authorization: `Bearer ${getAuthAccessToken(getState())}` }],
      params: [{ todoBody: body }]
    })
      .then((response) => {
        dispatch({
          type: TaskActions.ADD_TODO,
          payload: response.data
        })
      })
      .catch((error) => {
        dispatch({
          type: TaskActions.SET_ERROR_MESSAGE,
          payload: error.message
        })
      })
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: false })
  }
}

export const ToggleTodoStateAction = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: true })
    axios({
      url: `http://localhost:22222/api/todos/${id}`,
      method: 'patch',
      headers: [{ Authorization: `Bearer ${getAuthAccessToken(getState())}` }]
    })
      .then((response) => {
        dispatch({ type: TaskActions.TOGGLE_TODO_STATE, payload: id })
      })
      .catch((error) => {
        dispatch({
          type: TaskActions.SET_ERROR_MESSAGE,
          payload: error.message
        })
      })
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: false })
  }
}

export const EditTodoAction = (id, body) => {
  return (dispatch, getState) => {
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: true })
    axios({
      url: `http://localhost:22222/api/todos/${id}`,
      method: 'patch',
      headers: [{ Authorization: `Bearer ${getAuthAccessToken(getState())}` }],
      params: [{ todoBody: body }]
    })
      .then((response) => {
        dispatch({ type: TaskActions.EDIT_TODO, payload: { id, body } })
      })
      .catch((error) => {
        dispatch({
          type: TaskActions.SET_ERROR_MESSAGE,
          payload: error.message
        })
      })
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: false })
  }
}

export const ToggleTodoToBeDeletedStateAction = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TaskActions.TOGGLE_TODO_TO_BE_DELETED_STATE, payload: id })
  }
}

export const DeleteTodoPermanentlyAction = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: true })
    axios({
      url: `http://localhost:22222/api/todos/${id}`,
      method: 'delete',
      headers: [{ Authorization: `Bearer ${getAuthAccessToken(getState())}` }]
    })
      .then((response) => {
        dispatch({ type: TaskActions.DELETE_TODO_PERMANENTLY, payload: id })
      })
      .catch((error) => {
        dispatch({
          type: TaskActions.SET_ERROR_MESSAGE,
          payload: error.message
        })
      })
    dispatch({ type: TaskActions.SET_IS_LOADING_STATE, payload: false })
  }
}

export const ClearErrorMessageAction = () => {
  return { type: TaskActions.SET_ERROR_MESSAGE, payload: '' }
}
