import React from 'react'
import { Typography, Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Container from '../../components/Container'
import Header from '../../components/Header'
import Tabs from '../../components/Tabs'
import TransitionAlert from '../../components/TransitionAlert'
import TodoInput from '../../components/TodoInput'
import LoadingScreen from '../../components/LoadingScreen'
import { getLoadingState } from '../../store/selectors/taskSelector'

const TaskPage = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Container>
          <Header
            leftContent={
              <Typography variant="h4">Welcome, dear user!</Typography>
            }
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
      )}
    </>
  )
}

TaskPage.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
  return {
    isLoading: getLoadingState(state)
  }
}

export default connect(mapStateToProps, null)(TaskPage)
