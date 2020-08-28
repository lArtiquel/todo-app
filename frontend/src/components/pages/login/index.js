import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PageTemplate from '../../PageTemplate'
import { GetAuthIsLoading, GetAuthDialog } from '../../../store/selectors/Auth'
import { CloseDialog } from '../../../store/actions/Auth'
import Header from '../../Header'
import CoolButton from '../../CoolButton'
import Logo from '../../Logo'
import LoginForm from './LoginForm'

const LoginPage = ({ isLoading, dialog }) => {
  return (
    <PageTemplate
      REDUX_isPageLoading={isLoading}
      REDUX_pageDialog={dialog}
      PageHeader={
        <Header
          leftContent={<Logo align="start" />}
          rightContent={
            <CoolButton
              color="red"
              component={Link}
              to="/register"
              maxWidth={110}
            >
              Register
            </CoolButton>
          }
        />
      }
      PageContent={<LoginForm />}
    />
  )
}

LoginPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dialog: PropTypes.object.isRequired
}

const mapStateToProps = () => {
  return {
    isLoading: GetAuthIsLoading(),
    dialog: GetAuthDialog()
  }
}

const actionCreators = {
  closeDialog: CloseDialog
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    dialog: {
      ...stateProps.dialog,
      closeCallback: dispatchProps.closeDialog
    }
  }
}

export default connect(mapStateToProps, actionCreators, mergeProps)(LoginPage)
