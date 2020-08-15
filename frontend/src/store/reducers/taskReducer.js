import { TaskActions } from '../../constants/task'

const initState = {
  isLoading: false,
  message: '',
  lastDeletedTodoId: '',
  todos: []
}

export default function TaskReducer(state = initState, action) {
  switch (action.type) {
    case TaskActions.LOAD_TODOS: {
      return {
        ...state,
        todos: action.payload
      }
    }

    case TaskActions.CLEAR_TODOS_ARRAY: {
      return {
        ...state,
        todos: []
      }
    }

    case TaskActions.ADD_TODO: {
      return {
        ...state,
        todos: [
          {
            ...action.payload,
            isMarkedToBeDeleted: false
          },
          ...state.todos
        ]
      }
    }

    case TaskActions.TOGGLE_TODO_DONE_STATE: {
      return {
        ...state,
        todos: [
          ...state.todos.map((todo) => {
            if (todo.id === action.payload)
              return {
                ...todo,
                done: !todo.done
              }
            return todo
          })
        ]
      }
    }

    case TaskActions.EDIT_TODO: {
      return {
        ...state,
        todos: [
          ...state.todos.map((todo) => {
            if (todo.id === action.payload.id)
              return {
                ...todo,
                body: action.payload.body
              }
            return todo
          })
        ]
      }
    }

    case TaskActions.TOGGLE_TODO_TO_BE_DELETED_STATE: {
      return {
        ...state,
        todos: [
          ...state.todos.map((todo) => {
            if (todo.id === action.payload)
              return {
                ...todo,
                isMarkedToBeDeleted: !todo.isMarkedToBeDeleted
              }
            return todo
          })
        ],
        lastDeletedTodoId:
          action.payload === state.lastDeletedTodoId ? '' : action.payload
      }
    }

    case TaskActions.DELETE_TODO_PERMANENTLY: {
      return {
        ...state,
        todos: [...state.todos.filter((todo) => todo.id !== action.payload)],
        lastDeletedTodoId:
          action.payload === state.lastDeletedTodoId
            ? ''
            : state.lastDeletedTodoId
      }
    }

    case TaskActions.SET_IS_LOADING_STATE: {
      return {
        ...state,
        isLoading: action.payload
      }
    }

    case TaskActions.SET_TASK_MESSAGE: {
      return {
        ...state,
        message: action.payload
      }
    }

    default:
      return {
        ...state
      }
  }
}
