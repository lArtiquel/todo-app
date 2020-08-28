import React from 'react'
import { Box } from '@material-ui/core'
import PropTypes from 'prop-types'

const CenteredFlexBoxWithBorder = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={420}
      m={2}
    >
      <Box border={1} borderColor="text.primary" borderRadius={16}>
        <Box m={2}>{children}</Box>
      </Box>
    </Box>
  )
}

CenteredFlexBoxWithBorder.propTypes = {
  children: PropTypes.node
}

export default CenteredFlexBoxWithBorder
