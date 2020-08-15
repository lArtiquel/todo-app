import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getLoadingState } from '../../store/selectors/authSelector'
import Container from '../../components/Container'
import CenteredFlexContainer from '../../components/CenteredFlexContainer'
import Header from '../../components/Header'
import LoginForm from '../../components/LoginForm'
import CoolButton from '../../components/CoolButton'
import LoadingScreen from '../../components/LoadingScreen'
import Logo from '../../components/Logo'

const LoginPage = ({ isLoading }) => {
  return (
    <>
      {isLoading && <LoadingScreen />}
      <Container>
        <Header
          leftContent={<Logo />}
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
    </>
  )
}

LoginPage.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

const mapStateToProps = () => {
  return {
    isLoading: getLoadingState()
  }
}

export default connect(mapStateToProps)(LoginPage)
