/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { CancelPasswordReset } from '../../../../store/actions/Auth'

const CancelPasswordResetProcessor = ({ cancelPasswordReset }) => {
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    cancelPasswordReset({ history, location })
  }, [])
  return null
}

CancelPasswordResetProcessor.propTypes = {
  cancelPasswordReset: PropTypes.func.isRequired
}

const actionCreators = {
  cancelPasswordReset: CancelPasswordReset
}

export default connect(null, actionCreators)(CancelPasswordResetProcessor)
