import { TaskActions } from '../../constants/actions'

const initState = {
  lastDeletedTodoId: '',

  todos: [
    {
      id: 'FirstID',
      isDone: true,
      content: 'First todo',
      isMarkedToBeDeleted: false
    },
    {
      id: 'SecondID',
      isDone: false,
      content: 'Second todo',
      isMarkedToBeDeleted: false
    },
    {
      id: 'ThirdID',
      isDone: false,
      content: 'Third todo',
      isMarkedToBeDeleted: false
    },
    {
      id: '4',
      isDone: true,
      content: 'Clean floor.',
      isMarkedToBeDeleted: false
    },
    {
      id: '5',
      isDone: true,
      content: 'Wash dishes.',
      isMarkedToBeDeleted: false
    }
  ]
}

export default function TaskReducer(state = initState, action) {
  switch (action.type) {
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
                content: action.payload.content
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
        lastDeletedTodoId: action.payload
      }
    }

    case TaskActions.DELETE_TODO_PERMANENTLY: {
      return {
        ...state,
        todos: [...state.todos.filter((todo) => todo.id !== action.payload)]
      }
    }

    default:
      return {
        ...state
      }
  }
}
