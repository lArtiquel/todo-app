import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { AppBar, Tabs as MuiTabs, Tab, Box } from '@material-ui/core'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Todo from './Todo'
import { GetTodos } from '../../../store/selectors/Task'

function TodoTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

TodoTabPanel.propTypes = {
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

const TodoTabs = ({ my, todos }) => {
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
    <Box className={classes.root} my={my}>
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
        <TodoTabPanel value={value} index={0} dir={theme.direction}>
          {value === 0 &&
            todos.map((todo) => {
              return (
                <Todo
                  key={todo.id}
                  id={todo.id}
                  body={todo.body}
                  done={todo.done}
                />
              )
            })}
        </TodoTabPanel>
        <TodoTabPanel value={value} index={1} dir={theme.direction}>
          {value === 1 &&
            todos
              .filter((todo) => todo.done === false)
              .map((todo) => (
                <Todo
                  key={todo.id}
                  id={todo.id}
                  body={todo.body}
                  done={todo.done}
                />
              ))}
        </TodoTabPanel>
        <TodoTabPanel value={value} index={2} dir={theme.direction}>
          {value === 2 &&
            todos
              .filter((todo) => todo.done === true)
              .map((todo) => (
                <Todo
                  key={todo.id}
                  id={todo.id}
                  body={todo.body}
                  done={todo.done}
                />
              ))}
        </TodoTabPanel>
      </SwipeableViews>
    </Box>
  )
}

TodoTabs.propTypes = {
  my: PropTypes.number,
  todos: PropTypes.array.isRequired
}

const mapStateToProps = () => {
  return {
    todos: GetTodos()
  }
}

export default connect(mapStateToProps, null)(TodoTabs)
