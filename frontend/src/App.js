import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Theme from './theme'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import TaskPage from './pages/task'
import RouteProtector from './components/RouteProtector'

const App = () => {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/login" exact>
            <RouteProtector routeFor="NOT_AUTHENTICATED">
              <LoginPage />
            </RouteProtector>
          </Route>
          <Route path="/register" exact>
            <RouteProtector routeFor="NOT_AUTHENTICATED">
              <RegisterPage />
            </RouteProtector>
          </Route>
          {/* <Route path="/forgot" exact>
          <ForgotPage />
        </Route> */}
          <Route path="/" exact>
            <RouteProtector routeFor="AUTHENTICATED_ONLY">
              <TaskPage />
            </RouteProtector>
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App
