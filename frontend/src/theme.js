import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

const Theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
      primary: { main: '#ff9800' },
      secondary: { main: '#ff1744' },
      text: {
        primary: '#fff'
      }
    },
    spreddable: {}
  })
)

export default Theme
