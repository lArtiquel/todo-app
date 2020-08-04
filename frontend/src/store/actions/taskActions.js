import axios from 'axios'
import { TaskActions } from '../../constants/actions'

export const LoadTodosAction = () => {
  return (dispatch, getState) => {
    // make axios call to api
    dispatch({ type: TaskActions.LOAD_TODOS })
  }
}

export const AddTodoAction = (todoContent) => {
  return (dispatch, getState) => {
    // make call to api and push passed todo to reducer
    const exampleTodo = {
      id: (Math.random() * 101010100).toString(),
      content: todoContent,
      isDone: false
    }
    dispatch({ type: TaskActions.ADD_TODO, payload: exampleTodo })
  }
}

export const ToggleTodoStateAction = (id) => {
  return (dispatch, getState) => {
    // make call to api
    dispatch({ type: TaskActions.TOGGLE_TODO_STATE, payload: id })
  }
}

export const EditTodoAction = (id, content) => {
  return (dispatch, getState) => {
    // edit todo(use PATCH)
    dispatch({ type: TaskActions.EDIT_TODO, payload: { id, content } })
  }
}

export const ToggleTodoToBeDeletedStateAction = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TaskActions.TOGGLE_TODO_TO_BE_DELETED_STATE, payload: id })
  }
}

export const DeleteTodoPermanentlyAction = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: TaskActions.DELETE_TODO_PERMANENTLY, payload: id })
  }
}
