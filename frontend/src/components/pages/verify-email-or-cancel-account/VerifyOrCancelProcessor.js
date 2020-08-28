/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { VerifyEmailOrCancelAccount } from '../../../store/actions/Auth'

const VerifyOrCancelProcessor = ({ verifyEmailOrCancelAccount, cancel }) => {
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    verifyEmailOrCancelAccount({ location, cancel, history })
  }, [])
  return null
}

VerifyOrCancelProcessor.propTypes = {
  verifyEmailOrCancelAccount: PropTypes.func.isRequired,
  cancel: PropTypes.bool
}

const actionCreators = {
  verifyEmailOrCancelAccount: VerifyEmailOrCancelAccount
}

export default connect(null, actionCreators)(VerifyOrCancelProcessor)
