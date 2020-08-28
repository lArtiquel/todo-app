import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    background: (props) =>
      props.color === 'red'
        ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 18,
    boxShadow: (props) =>
      props.color === 'red'
        ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
        : '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 32,
    maxWidth: (props) => (props.maxWidth ? props.maxWidth : 'auto'),
    padding: '0 30px',
    margin: 5
  }
})

function CoolButton(props) {
  const styles = useStyles(props)
  const { color, maxWidth, ...other } = props
  return <Button className={styles.root} {...other} />
}

CoolButton.propTypes = {
  color: PropTypes.oneOf(['blue', 'red']).isRequired,
  maxWidth: PropTypes.number
}

export default CoolButton
