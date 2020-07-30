import { combineReducers } from 'redux'
import TaskReducer from './taskReducer'

const RootReducer = combineReducers({
  task: TaskReducer
})

export default RootReducer
