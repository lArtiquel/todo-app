import stringify from 'qs-stringify'
import { TaskActionTypes } from '../constants/Task'
import axios from '../../config/Axios'

export const LoadTodos = () => {
  return async (dispatch) => {
    dispatch({ type: TaskActionTypes.SET_LOADING_STATE, payload: true })
    try {
      const response = await axios({
        url: '/api/todos',
        method: 'get'
      })
      dispatch({
        type: TaskActionTypes.LOAD_TODOS,
        payload: response.data
      })
    } catch (error) {
      dispatch({
        type: TaskActionTypes.SET_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: error.response
            ? error.response.data.message || 'Failed to load todos.'
            : 'No response received... Check your internet connection!'
        }
      })
    }
    dispatch({ type: TaskActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const ClearTodosArray = () => {
  return { type: TaskActionTypes.CLEAR_TODOS_ARRAY }
}

export const AddTodo = (body) => {
  return async (dispatch) => {
    dispatch({ type: TaskActionTypes.SET_LOADING_STATE, payload: true })
    try {
      const response = await axios({
        url: '/api/todos',
        method: 'post',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: stringify({ todoBody: body })
      })
      dispatch({
        type: TaskActionTypes.ADD_TODO,
        payload: response.data
      })
    } catch (error) {
      dispatch({
        type: TaskActionTypes.SET_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: error.response
            ? error.response.data.message ||
              'Failed to create new todo on server.'
            : 'No response received... Check your internet connection!'
        }
      })
    }
    dispatch({ type: TaskActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const ToggleTodoDoneState = (id) => {
  return async (dispatch) => {
    dispatch({ type: TaskActionTypes.SET_LOADING_STATE, payload: true })
    try {
      await axios({
        url: `/api/todos/${id}`,
        method: 'patch'
      })
      dispatch({ type: TaskActionTypes.TOGGLE_TODO_DONE_STATE, payload: id })
    } catch (error) {
      dispatch({
        type: TaskActionTypes.SET_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: error.response
            ? error.response.data.message || 'Failed to toggle todo on server.'
            : 'No response received... Check your internet connection!'
        }
      })
    }
    dispatch({ type: TaskActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const EditTodo = (id, body) => {
  return async (dispatch) => {
    dispatch({ type: TaskActionTypes.SET_LOADING_STATE, payload: true })
    try {
      await axios({
        url: `/api/todos/${id}`,
        method: 'patch',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: stringify({ todoBody: body })
      })
      dispatch({ type: TaskActionTypes.EDIT_TODO, payload: { id, body } })
    } catch (error) {
      dispatch({
        type: TaskActionTypes.SET_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: error.response
            ? error.response.data.message || 'Failed to edit todo on server.'
            : 'No response received... Check your internet connection!'
        }
      })
    }
    dispatch({ type: TaskActionTypes.SET_LOADING_STATE, payload: false })
  }
}

export const ToggleTodoToBeDeletedState = (id) => {
  return { type: TaskActionTypes.TOGGLE_TODO_TO_BE_DELETED_STATE, payload: id }
}

export const DeleteTodoPermanently = (id) => {
  return async (dispatch) => {
    try {
      await axios({
        url: `/api/todos/${id}`,
        method: 'delete'
      })
    } catch (error) {
      dispatch({
        type: TaskActionTypes.SET_DIALOG,
        payload: {
          isActive: true,
          header: 'Error',
          message: error.response
            ? error.response.data.message || 'Failed to delete todo on server.'
            : 'No response received... Check your internet connection!'
        }
      })
      // return back todo from `to be deleted state`
      dispatch({
        type: TaskActionTypes.TOGGLE_TODO_TO_BE_DELETED_STATE,
        payload: id
      })
    }
  }
}

export const CloseDialog = () => {
  return {
    type: TaskActionTypes.SET_DIALOG,
    payload: {
      isActive: false,
      header: '',
      message: '',
      customOnCloseAction: null
    }
  }
}
