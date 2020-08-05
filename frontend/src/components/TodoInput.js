import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Box, Button, TextField } from '@material-ui/core'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AddTodoAction } from '../store/actions/taskActions'

const TodoInput = ({ my, addTodo }) => {
  const [todo, setTodo] = useState('')
  const inputRef = useRef()

  const handleTodoChange = (e) => {
    setTodo(e.target.value)
  }

  const handleCreateTodoButtonClick = () => {
    if (todo !== '') {
      // trigger add todo action
      addTodo(todo)
      // clear todo in state
      setTodo('')
    }
  }

  const addTodoEnterKeyCallback = useCallback(
    (e) => {
      if ((e.key === 'Enter' || e.keyCode === 13) && todo !== '') {
        // trigger add todo action
        addTodo(todo)
        // clear todo in state
        setTodo('')
        // stop this event propagation from bubbling up
        e.stopPropagation()
      }
    },
    [todo]
  )

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('keyup', addTodoEnterKeyCallback)
    }

    return () => {
      inputRef.current.removeEventListener('keyup', addTodoEnterKeyCallback)
    }
  }, [inputRef.current, addTodoEnterKeyCallback])

  return (
    <Box my={my} display="flex">
      <TextField
        ref={inputRef}
        label="What needs to be done?"
        name="todo"
        variant="outlined"
        margin="dense"
        autoFocus
        fullWidth
        value={todo}
        onChange={handleTodoChange}
      />
      <Box m={1}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCreateTodoButtonClick}
        >
          Create
        </Button>
      </Box>
    </Box>
  )
}

TodoInput.propTypes = {
  my: PropTypes.number,
  addTodo: PropTypes.func.isRequired
}

const mapActionToProps = (dispatch) => {
  return {
    addTodo: (content) => dispatch(AddTodoAction(content))
  }
}

export default connect(null, mapActionToProps)(TodoInput)
