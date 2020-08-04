import { combineReducers } from 'redux'
import TaskReducer from './taskReducer'
import AuthReducer from './authReducer'

const RootReducer = combineReducers({
  task: TaskReducer,
  auth: AuthReducer
})

export default RootReducer
