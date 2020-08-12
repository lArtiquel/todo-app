import { TaskActions } from '../../constants/taskActions'

const initState = {
  isLoading: false,
  errorMessage: '',
  lastDeletedTodoId: '',
  todos: [
    {
      id: 'FirstID',
      isDone: true,
      body: 'First todo',
      isMarkedToBeDeleted: false
    },
    {
      id: 'SecondID',
      isDone: false,
      body: 'Second todo',
      isMarkedToBeDeleted: false
    },
    {
      id: 'ThirdID',
      isDone: false,
      body: 'Third todo',
      isMarkedToBeDeleted: false
    },
    {
      id: '4',
      isDone: true,
      body: 'Clean floor.',
      isMarkedToBeDeleted: false
    },
    {
      id: '5',
      isDone: true,
      body: 'Wash dishes.',
      isMarkedToBeDeleted: false
    }
  ]
}

export default function TaskReducer(state = initState, action) {
  switch (action.type) {
    case TaskActions.LOAD_TODOS: {
      return {
        ...state,
        todos: action.payload
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

    case TaskActions.TOGGLE_TODO_STATE: {
      return {
        ...state,
        todos: [
          ...state.todos.map((todo) => {
            if (todo.id === action.payload)
              return {
                ...todo,
                isDone: !todo.isDone
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

    case TaskActions.SET_ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage: action.payload
      }
    }

    default:
      return {
        ...state
      }
  }
}
