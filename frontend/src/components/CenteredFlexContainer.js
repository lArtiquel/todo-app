import React from 'react'
import { Box } from '@material-ui/core'
import PropTypes from 'prop-types'

const CenteredFlexContainer = ({ children }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      paddingTop={8}
      paddingBottom={8}
    >
      <Box border={1} borderColor="text.primary" borderRadius={16}>
        {children}
      </Box>
    </Box>
  )
}

CenteredFlexContainer.propTypes = {
  children: PropTypes.node
}

export default CenteredFlexContainer
