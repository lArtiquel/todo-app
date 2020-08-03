import React from 'react'
import Alert from '@material-ui/lab/Alert'
import { IconButton, Button } from '@material-ui/core/'
import Collapse from '@material-ui/core/Collapse'
import PropTypes from 'prop-types'

const TransitionAlert = ({ content }) => {
  const [open, setOpen] = React.useState(true)

  return (
    <Collapse in={open}>
      <Alert
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false)
            }}
          >
            UNDO
          </Button>
        }
      >
        {content}
      </Alert>
    </Collapse>
  )
}

TransitionAlert.propTypes = {
  content: PropTypes.string.isRequired
}

export default TransitionAlert
