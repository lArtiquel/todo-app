import stringify from 'qs-stringify'
import { TaskActions } from '../../constants/task'
import axios from '../../config/axios'

export const LoadTodosAction = () => {
  return (dispatch) => {
    // first of all toggle isLoading var to display loading screen
    dispatch({ type: TaskActions.SET_TASK_LOADING_STATE, payload: true })
    // make axios call to fetch all todos from server
    axios({
      url: '/api/todos',
      method: 'get'
    })
      .then((response) => {
        // push todos into state
        dispatch({
          type: TaskActions.LOAD_TODOS,
          payload: response.data
        })
      })
      .catch((error) => {
        // set request error
        dispatch({
          type: TaskActions.SET_TASK_MESSAGE,
          payload: 'Failed to load todos.'
        })
      })
      .finally(() => {
        // set isLoading var in state back to false
        dispatch({ type: TaskActions.SET_TASK_LOADING_STATE, payload: false })
      })
  }
}

export const ClearTodosArrayAction = () => {
  return { type: TaskActions.CLEAR_TODOS_ARRAY }
}

export const AddTodoAction = (body) => {
  return (dispatch) => {
    dispatch({ type: TaskActions.SET_TASK_LOADING_STATE, payload: true })
    // create new todo on server
    axios({
      url: '/api/todos',
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: stringify({ todoBody: body })
    })
      .then((response) => {
        dispatch({
          type: TaskActions.ADD_TODO,
          payload: response.data
        })
      })
      .catch((error) => {
        dispatch({
          type: TaskActions.SET_TASK_MESSAGE,
          payload: 'Failed to create new todo on server.'
        })
      })
      .finally(() => {
        // set isLoading var in state back to false
        dispatch({ type: TaskActions.SET_TASK_LOADING_STATE, payload: false })
      })
  }
}

export const ToggleTodoDoneStateAction = (id) => {
  return (dispatch) => {
    dispatch({ type: TaskActions.SET_TASK_LOADING_STATE, payload: true })
    axios({
      url: `/api/todos/${id}`,
      method: 'patch'
    })
      .then((response) => {
        dispatch({ type: TaskActions.TOGGLE_TODO_DONE_STATE, payload: id })
      })
      .catch((error) => {
        dispatch({
          type: TaskActions.SET_TASK_MESSAGE,
          payload: 'Failed to complete todo on server.'
        })
      })
      .finally(() => {
        // set isLoading var in state back to false
        dispatch({ type: TaskActions.SET_TASK_LOADING_STATE, payload: false })
      })
  }
}

export const EditTodoAction = (id, body) => {
  return (dispatch) => {
    dispatch({ type: TaskActions.SET_TASK_LOADING_STATE, payload: true })
    axios({
      url: `/api/todos/${id}`,
      method: 'patch',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: stringify({ todoBody: body })
    })
      .then((response) => {
        dispatch({ type: TaskActions.EDIT_TODO, payload: { id, body } })
      })
      .catch((error) => {
        dispatch({
          type: TaskActions.SET_TASK_MESSAGE,
          payload: 'Failed to edit todo on server.'
        })
      })
      .finally(() => {
        // set isLoading var in state back to false
        dispatch({ type: TaskActions.SET_TASK_LOADING_STATE, payload: false })
      })
  }
}

export const ToggleTodoToBeDeletedStateAction = (id) => {
  return { type: TaskActions.TOGGLE_TODO_TO_BE_DELETED_STATE, payload: id }
}

export const DeleteTodoPermanentlyAction = (id) => {
  return (dispatch) => {
    axios({
      url: `/api/todos/${id}`,
      method: 'delete'
    })
      .then((response) => {
        dispatch({ type: TaskActions.DELETE_TODO_PERMANENTLY, payload: id })
      })
      .catch((error) => {
        dispatch({
          type: TaskActions.SET_TASK_MESSAGE,
          payload: 'Failed to delete todo on server.'
        })
        // return back todo from `to be deleted state`
        dispatch({
          type: TaskActions.TOGGLE_TODO_TO_BE_DELETED_STATE,
          payload: id
        })
      })
  }
}

export const ClearErrorMessageAction = () => {
  return { type: TaskActions.SET_TASK_MESSAGE, payload: '' }
}
