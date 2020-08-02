import React from 'react'
import { Typography } from '@material-ui/core'
import Container from '../../components/Container'
import CenteredFlexContainer from '../../components/CenteredFlexContainer'
import Header from '../../components/Header'
import RegisterForm from '../../components/RegisterForm'

export default function RegisterPage() {
  return (
    <Container>
      <Header
        leftContent={
          <Typography variant="h4" align="center">
            Welcome to Arti's ToDoDo app
          </Typography>
        }
      />
      <CenteredFlexContainer>
        <RegisterForm />
      </CenteredFlexContainer>
    </Container>
  )
}
