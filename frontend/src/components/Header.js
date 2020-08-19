import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  leftContent: {
    [theme.breakpoints.only('xs')]: {
      maxWidth: 200
    }
  },
  rightContent: {
    [theme.breakpoints.only('xs')]: {
      maxWidth: 120
    }
  }
}))

const Header = ({ leftContent, rightContent }) => {
  const styles = useStyles()

  return (
    <Box display="flex" mb={2} boxShadow={8}>
      {leftContent && (
        <Box
          display="flex"
          flexDirection="row"
          flexGrow={1}
          className={styles.leftContent}
        >
          {leftContent}
        </Box>
      )}
      {rightContent && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          className={styles.rightContent}
        >
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
