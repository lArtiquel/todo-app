export const getTodos = (state) => {
  return state.task.todos.filter((todo) => !todo.isMarkedToBeDeleted)
}

export const getDeletedTodoId = (state) => {
  return state.task.lastDeletedTodoId
}
