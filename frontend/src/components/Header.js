import React from 'react'
import { Box } from '@material-ui/core'
import PropTypes from 'prop-types'

const Header = ({ leftContent, rightContent }) => {
  return (
    <Box display="flex" my={2} boxShadow={8}>
      {leftContent && (
        <Box flexGrow={2} my={1}>
          {leftContent}
        </Box>
      )}
      {rightContent && (
        <Box flexGrow={1} my={1}>
          {rightContent}
        </Box>
      )}
    </Box>
  )
}

Header.propTypes = {
  leftContent: PropTypes.any,
  rightContent: PropTypes.any
}

export default Header
