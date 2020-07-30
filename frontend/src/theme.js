import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

const Theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
      primary: { main: '#9c27b0' },
      secondary: { main: '#2732b0' },
      text: {
        secondary: '#fff'
      }
    },
    spreddable: {}
  })
)

export default Theme
