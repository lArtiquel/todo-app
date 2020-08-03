import React from 'react'
import {
  Typography,
  Box,
  Button,
  TextField,
  IconButton
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import Header from '../../components/Header'
import Tabs from '../../components/Tabs'
import TransitionAlert from '../../components/TransitionAlert'

export default function TodoPage() {
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
          label="What needs to be done?"
          name="todo"
          variant="outlined"
          type="text"
          margin="dense"
          autoFocus
          fullWidth
        />
      </Box>
      <Box my={2}>
        <TransitionAlert content="Task deleted!" />
      </Box>
      <Tabs />
    </Container>
  )
}
