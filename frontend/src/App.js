import React from 'react'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import Theme from './theme'

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#1a181a',
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'auto'
  }
}))

const App = () => {
  const styles = useStyles()

  return (
    <ThemeProvider theme={Theme}>
      <div className={styles.root}>Hi</div>
    </ThemeProvider>
  )
}

export default App
