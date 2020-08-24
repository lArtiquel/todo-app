import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import LoadingScreen from '../../components/LoadingScreen'
import {
  getLoadingState,
  getDialog
} from '../../store/selectors/verifyEmailSelector'
import {
  VerifyEmailAction,
  CloseDialogAction
} from '../../store/actions/verifyEmailActions'
import Dialog from '../../components/KeepInTouchDialog'

const EmailVerificationPage = ({ isLoading, verifyEmail, dialog }) => {
  const history = useHistory()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    verifyEmail(urlParams)
  }, [verifyEmail])

  return (
    <>
      {isLoading && <LoadingScreen />}
      {dialog.isActive && (
        <Dialog
          header={dialog.header}
          message={dialog.message}
          closeCallback={() => dialog.closeCallback(history)}
        />
      )}
    </>
  )
}

EmailVerificationPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  verifyEmail: PropTypes.func.isRequired,
  dialog: PropTypes.shape({
    isActive: PropTypes.bool.isRequired,
    header: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    closeCallback: PropTypes.func.isRequired
  }).isRequired
}

const mapStateToProps = () => {
  return {
    isLoading: getLoadingState(),
    dialog: getDialog()
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    verifyEmail: (urlParams) => dispatch(VerifyEmailAction(urlParams)),
    dialog: {
      closeCallback: (history) => dispatch(CloseDialogAction(history))
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(EmailVerificationPage)
