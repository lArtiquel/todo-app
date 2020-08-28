import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GetAuthIsLoading, GetAuthDialog } from '../../../store/selectors/Auth'
import { CloseDialog } from '../../../store/actions/Auth'
import PageTemplate from '../../PageTemplate'
import VerifyOrCancelProcessor from './VerifyOrCancelProcessor'

const VerifyOrCancelPage = ({ isLoading, dialog, cancel }) => {
  return (
    <PageTemplate
      REDUX_isPageLoading={isLoading}
      REDUX_pageDialog={dialog}
      PageContent={<VerifyOrCancelProcessor cancel={cancel} />}
    />
  )
}

VerifyOrCancelPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  dialog: PropTypes.object.isRequired,
  cancel: PropTypes.bool
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
)(VerifyOrCancelPage)
