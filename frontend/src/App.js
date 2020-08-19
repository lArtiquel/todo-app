import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import Theme from './theme'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import TaskPage from './pages/task'
import RouteWithProtection from './components/RouteWithProtection'

const App = () => {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <RouteWithProtection path="/login" exact routeFor="NOT_AUTHENTICATED">
            <LoginPage />
          </RouteWithProtection>
          <RouteWithProtection
            path="/register"
            exact
            routeFor="NOT_AUTHENTICATED"
          >
            <RegisterPage />
          </RouteWithProtection>
          {/* <Route path="/forgot" exact>
          <ForgotPage />
        </Route> */}
          <RouteWithProtection path="/" routeFor="AUTHENTICATED_ONLY">
            <TaskPage />
          </RouteWithProtection>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App
