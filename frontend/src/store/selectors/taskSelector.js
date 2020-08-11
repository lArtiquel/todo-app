export const getTodos = (state) => {
  return state.task.todos.filter((todo) => !todo.isMarkedToBeDeleted)
}

export const getDeletedTodoId = (state) => {
  return state.task.lastDeletedTodoId
}

export const getLoadingState = (state) => {
  return state.task.isLoading
}
