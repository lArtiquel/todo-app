import React from 'react'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  AppBar,
  Tabs as MuiTabs,
  Tab,
  Typography,
  Box
} from '@material-ui/core'
import Todo from './Todo'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper
  }
}))

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

const TODOS = [
  {
    id: 'FirstID',
    isDone: true,
    content: 'First todo'
  },
  {
    id: 'SecondID',
    isDone: false,
    content: 'Second todo'
  },
  {
    id: 'ThirdID',
    isDone: false,
    content: 'Third todo'
  }
]

export default function Tabs() {
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <MuiTabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="todo tabs"
        >
          <Tab label="All" {...a11yProps(0)} />
          <Tab label="Active" {...a11yProps(1)} />
          <Tab label="Completed" {...a11yProps(2)} />
        </MuiTabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          {TODOS.map((todo) => (
            <Todo id={todo.id} content={todo.content} />
          ))}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          {TODOS.filter((todo) => todo.isDone === false).map((todo) => (
            <Todo id={todo.id} content={todo.content} />
          ))}
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          {TODOS.filter((todo) => todo.isDone === true).map((todo) => (
            <Todo id={todo.id} content={todo.content} />
          ))}
        </TabPanel>
      </SwipeableViews>
    </div>
  )
}
