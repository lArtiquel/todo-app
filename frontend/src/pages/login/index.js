import React from 'react'
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import CenteredFlexContainer from '../../components/CenteredFlexContainer'
import Header from '../../components/Header'
import LoginForm from '../../components/LoginForm'
import CoolButton from '../../components/CoolButton'

export default function LoginPage() {
  return (
    <Container>
      <Header
        leftContent={
          <Typography variant="h4">Welcome to Arti's TODO app</Typography>
        }
        rightContent={
          <CoolButton color="red" component={Link} to="/register">
            Register
          </CoolButton>
        }
      />
      <CenteredFlexContainer>
        <LoginForm />
      </CenteredFlexContainer>
    </Container>
  )
}
