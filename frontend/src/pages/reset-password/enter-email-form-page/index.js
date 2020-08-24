import React, { useState } from 'react'
import Container from '../../../components/Container'
import CenteredFlexContainer from '../../../components/CenteredFlexContainer'
import Header from '../../../components/Header'
import LoadingScreen from '../../../components/LoadingScreen'
import Dialog from '../../../components/KeepInTouchDialog'
import Logo from '../../../components/Logo'
import EmailForm from './EmailForm'

const EnterEmailFormPage = () => {
  const [isLoading, setLoading] = useState(false)
  const [dialogInfo, setDialogInfo] = useState({
    isActive: false,
    header: '',
    message: ''
  })

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Container>
        <Header leftContent={<Logo align="center" />} />
        <CenteredFlexContainer>
          <EmailForm setLoading={setLoading} setDialogInfo={setDialogInfo} />
        </CenteredFlexContainer>
      </Container>
      {dialogInfo.isActive && (
        <Dialog
          header={dialogInfo.header}
          message={dialogInfo.message}
          closeCallback={() =>
            setDialogInfo({ isActive: false, header: '', message: '' })
          }
        />
      )}
    </>
  )
}

export default EnterEmailFormPage
