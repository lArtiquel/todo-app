import store from '../store'

export const getTodos = () => {
  return store.getState().task.todos.filter((todo) => !todo.isMarkedToBeDeleted)
}

export const getDeletedTodoId = () => {
  return store.getState().task.lastDeletedTodoId
}

export const getLoadingState = () => {
  return store.getState().task.isLoading
}

export const getMessage = () => {
  return store.getState().task.message
}
