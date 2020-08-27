import { TaskActionTypes } from '../constants/Task'

const initState = {
  isLoading: false,
  dialog: {
    isActive: false,
    header: '',
    message: ''
  },
  lastDeletedTodoId: '',
  todos: []
}

export default function TaskReducer(state = initState, action) {
  switch (action.type) {
    case TaskActionTypes.LOAD_TODOS: {
      return {
        ...state,
        todos: action.payload
      }
    }

    case TaskActionTypes.CLEAR_TODOS_ARRAY: {
      return {
        ...state,
        todos: []
      }
    }

    case TaskActionTypes.ADD_TODO: {
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

    case TaskActionTypes.TOGGLE_TODO_DONE_STATE: {
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

    case TaskActionTypes.EDIT_TODO: {
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

    case TaskActionTypes.TOGGLE_TODO_TO_BE_DELETED_STATE: {
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

    case TaskActionTypes.DELETE_TODO_PERMANENTLY: {
      return {
        ...state,
        todos: [...state.todos.filter((todo) => todo.id !== action.payload)],
        lastDeletedTodoId:
          action.payload === state.lastDeletedTodoId
            ? ''
            : state.lastDeletedTodoId
      }
    }

    case TaskActionTypes.SET_LOADING_STATE: {
      return {
        ...state,
        isLoading: action.payload
      }
    }

    case TaskActionTypes.SET_DIALOG: {
      return {
        ...state,
        dialog: action.payload
      }
    }

    default:
      return {
        ...state
      }
  }
}
