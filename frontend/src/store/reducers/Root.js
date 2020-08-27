import { combineReducers } from 'redux'
import TaskReducer from './Task'
import AuthReducer from './Auth'

const RootReducer = combineReducers({
  task: TaskReducer,
  auth: AuthReducer
})

export default RootReducer
