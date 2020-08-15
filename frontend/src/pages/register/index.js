import React from 'react'
import { Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getLoadingState } from '../../store/selectors/authSelector'
import Container from '../../components/Container'
import CenteredFlexContainer from '../../components/CenteredFlexContainer'
import Header from '../../components/Header'
import RegisterForm from '../../components/RegisterForm'
import LoadingScreen from '../../components/LoadingScreen'

const RegisterPage = ({ isLoading }) => {
  return (
    <>
      {isLoading && <LoadingScreen />}
      <Container>
        <Header
          leftContent={
            <Typography variant="h4" align="center">
              Welcome to Arti's TODO app
            </Typography>
          }
        />
        <CenteredFlexContainer>
          <RegisterForm />
        </CenteredFlexContainer>
      </Container>
    </>
  )
}

RegisterPage.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

const mapStateToProps = () => {
  return {
    isLoading: getLoadingState()
  }
}

export default connect(mapStateToProps)(RegisterPage)
