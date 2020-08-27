import store from '../store'

export const GetTodos = () => {
  return store.getState().task.todos.filter((todo) => !todo.isMarkedToBeDeleted)
}

export const GetDeletedTodoId = () => {
  return store.getState().task.lastDeletedTodoId
}

export const GetTaskLoadingState = () => {
  return store.getState().task.isLoading
}

export const GetTaskDialog = () => {
  return store.getState().task.dialog
}
