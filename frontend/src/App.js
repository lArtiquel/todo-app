import React from 'react'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Theme from './theme'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import TodoPage from './pages/todo'

const App = () => {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/login" exact>
            <LoginPage />
          </Route>
          <Route path="/register" exact>
            <RegisterPage />
          </Route>
          {/* <Route path="/forgot" exact>
          <ForgotPage />
        </Route> */}
          <Route path="/" exact>
            <TodoPage />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App
