import React, { useEffect, useState, useRef } from 'react'
import {
  Typography,
  Box,
  Button,
  TextField,
  IconButton
} from '@material-ui/core'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Container from '../../components/Container'
import Header from '../../components/Header'
import Tabs from '../../components/Tabs'
import TransitionAlert from '../../components/TransitionAlert'
import { AddTodoAction } from '../../store/actions/taskActions'

const TaskPage = ({ addTodo }) => {
  const [todoContent, setTodoContent] = useState('')
  const inputRef = useRef()

  const onAddTodo = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      // TODO: check here
      console.log(todoContent)
      addTodo(todoContent)
      setTodoContent('')
      e.stopPropagation()
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('keyup', onAddTodo)
    }

    return () => {
      if (inputRef.current)
        inputRef.current.removeEventListener('keyup', onAddTodo)
    }
  }, [inputRef.current])

  return (
    <Container>
      <Header
        leftContent={<Typography variant="h4">Welcome, dear user!</Typography>}
        rightContent={
          <Button variant="outlined" color="secondary">
            Logout
          </Button>
        }
      />
      <Box my={3}>
        <TextField
          ref={inputRef}
          label="What needs to be done?"
          name="todo"
          variant="outlined"
          margin="dense"
          autoFocus
          fullWidth
          value={todoContent}
          onChange={(e) => setTodoContent(e.target.value)}
        />
      </Box>
      <Box my={2}>
        <TransitionAlert content="Task deleted!" />
      </Box>
      <Tabs />
    </Container>
  )
}

TaskPage.propTypes = {
  addTodo: PropTypes.func.isRequired
}

const mapActionToProps = (dispatch) => {
  return {
    addTodo: (content) => dispatch(AddTodoAction(content))
  }
}

export default connect(null, mapActionToProps)(TaskPage)
