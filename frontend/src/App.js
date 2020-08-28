import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import Theme from './theme'
import LoginPage from './components/pages/login'
import RegisterPage from './components/pages/register'
import TaskPage from './components/pages/task'
import PasswordResetEnterEmailPage from './components/pages/reset-password/enter-email'
import PasswordResetEnterPasswordPage from './components/pages/reset-password/enter-password'
import CancelPasswordResetProcessorPage from './components/pages/reset-password/cancel-password-reset'
import VerifyOrCancelPage from './components/pages/verify-email-or-cancel-account'
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
          <RouteWithProtection
            path="/reset-password/enter-email"
            exact
            routeFor="NOT_AUTHENTICATED"
          >
            <PasswordResetEnterEmailPage />
          </RouteWithProtection>
          <RouteWithProtection
            path="/reset-password/enter-password"
            exact
            routeFor="NOT_AUTHENTICATED"
          >
            <PasswordResetEnterPasswordPage />
          </RouteWithProtection>
          <RouteWithProtection
            path="/cancel-password-reset"
            exact
            routeFor="NOT_AUTHENTICATED"
          >
            <CancelPasswordResetProcessorPage />
          </RouteWithProtection>
          <RouteWithProtection
            path="/verify-email"
            exact
            routeFor="NOT_AUTHENTICATED"
          >
            <VerifyOrCancelPage />
          </RouteWithProtection>
          <RouteWithProtection
            path="/cancel-account"
            exact
            routeFor="NOT_AUTHENTICATED"
          >
            <VerifyOrCancelPage cancel />
          </RouteWithProtection>
          <RouteWithProtection path="/" routeFor="AUTHENTICATED_ONLY">
            <TaskPage />
          </RouteWithProtection>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App
