import React from 'react'
import { Typography, Button } from '@material-ui/core'
import Container from '../../components/Container'
import Header from '../../components/Header'
import Tabs from '../../components/Tabs'
import TransitionAlert from '../../components/TransitionAlert'
import TodoInput from '../../components/TodoInput'

const TaskPage = () => {
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
      <TodoInput my={3} />
      <TransitionAlert my={2} content="Task deleted!" />
      <Tabs my={2} />
    </Container>
  )
}

export default TaskPage
