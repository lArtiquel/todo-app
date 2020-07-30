import { TaskActions } from '../../constants/actions'

const initState = {}

export default function TaskReducer(state = initState, action) {
  switch (action.type) {
    default:
      return {
        ...state
      }
  }
}
