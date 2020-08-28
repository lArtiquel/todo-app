import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  GetAuthIsLoading,
  GetAuthDialog
} from '../../../../store/selectors/Auth'
import { CloseDialog } from '../../../../store/actions/Auth'
import PageTemplate from '../../../PageTemplate'
import NewPasswordForm from './NewPasswordForm'

const EnterPasswordFormPage = ({ isLoading, dialog }) => (
  <PageTemplate
    REDUX_isPageLoading={isLoading}
    REDUX_pageDialog={dialog}
    PageContent={<NewPasswordForm />}
  />
)

EnterPasswordFormPage.propTypes = {
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

export default connect(
  mapStateToProps,
  actionCreators,
  mergeProps
)(EnterPasswordFormPage)
