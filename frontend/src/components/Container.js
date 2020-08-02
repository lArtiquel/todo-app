import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0)
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(36),
      paddingRight: theme.spacing(36)
    }
  }
}))

const Container = ({ children }) => {
  const styles = useStyles()
  return <Box className={styles.root}>{children}</Box>
}

Container.propTypes = {
  children: PropTypes.any
}

export default Container
