import React from 'react'
import PropTypes from 'prop-types'
import Container from './Container'
import Header from './Header'
import LoadingScreen from './LoadingScreen'
import Dialog from './KeepInTouchDialog'
import Logo from './Logo'

const PageTemplate = ({
  REDUX_isPageLoading, // flag responsible for showing/not showing LoadingScreen component and controlled by Redux
  REDUX_pageDialog, // page dialog struct if it is controlled by Redux
  PageHeader, // PageHeader component, use only if u want to override default header with logo in the center
  PageContent // PageContent component - main page content displayed under PageHeader
}) => {
  const drawDialog = () => {
    if (REDUX_pageDialog && REDUX_pageDialog.isActive) {
      return (
        <Dialog
          header={REDUX_pageDialog.header}
          message={REDUX_pageDialog.message}
          closeCallback={() => {
            if (typeof REDUX_pageDialog.customOnCloseAction === 'function')
              REDUX_pageDialog.customOnCloseAction()
            REDUX_pageDialog.closeCallback()
          }}
        />
      )
    }
    return null
  }

  return (
    <>
      {REDUX_isPageLoading && <LoadingScreen />}
      <Container>
        {PageHeader || <Header leftContent={<Logo align="center" />} />}
        {PageContent}
      </Container>
      {drawDialog()}
    </>
  )
}

PageTemplate.propTypes = {
  REDUX_isPageLoading: PropTypes.bool,
  REDUX_pageDialog: PropTypes.exact({
    isActive: PropTypes.bool.isRequired,
    header: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    customOnCloseAction: PropTypes.func,
    closeCallback: PropTypes.func.isRequired
  }),
  PageHeader: PropTypes.element,
  PageContent: PropTypes.element
}

export default PageTemplate
