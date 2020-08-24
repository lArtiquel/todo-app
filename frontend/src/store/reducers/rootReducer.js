import { combineReducers } from 'redux'
import TaskReducer from './taskReducer'
import AuthReducer from './authReducer'
import VerifyEmailReducer from './verifyEmailReducer'

const RootReducer = combineReducers({
  task: TaskReducer,
  auth: AuthReducer,
  verifyEmail: VerifyEmailReducer
})

export default RootReducer
