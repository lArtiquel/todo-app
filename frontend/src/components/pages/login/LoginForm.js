import React, { useState } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import CenteredFlexBoxWithBorder from '../../CenteredFlexBoxWithBorder'
import CoolButton from '../../CoolButton'
import { Login } from '../../../store/actions/Auth'

const INITIAL_FORM_STATE = {
  email: '',
  password: ''
}

const LoginForm = ({ login }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE)

  const handleFormFieldChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <CenteredFlexBoxWithBorder>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      <Formik
        initialValues={{
          email: INITIAL_FORM_STATE.email,
          password: INITIAL_FORM_STATE.password
        }}
        onSubmit={(values, actions) => {
          login({ form })
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Field should contain valid email.')
            .required('Email is required.'),
          password: Yup.string()
            .min(6, 'Password should contain at least 6 characters.')
            .required('Password is required.')
        })}
        validateOnChange
        validateOnBlur
      >
        {({ errors, touched }) => (
          <FormikForm onChange={handleFormFieldChange}>
            <Field
              as={TextField}
              label="Email"
              name="email"
              variant="outlined"
              type="email"
              autoFocus
              margin="dense"
              fullWidth
              error={errors.email && touched.email}
              helperText={errors.email && touched.email ? errors.email : ''}
            />
            <Field
              as={TextField}
              label="Password"
              name="password"
              variant="outlined"
              type="password"
              margin="dense"
              fullWidth
              error={errors.password && touched.password}
              helperText={
                errors.password && touched.password ? errors.password : ''
              }
            />
            <Box display="flex" justifyContent="center" m={1}>
              <CoolButton color="blue" type="submit">
                Login
              </CoolButton>
            </Box>
          </FormikForm>
        )}
      </Formik>
      <Link to="/reset-password/enter-email">Forgot the password?</Link>
    </CenteredFlexBoxWithBorder>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

const actionCreators = {
  login: Login
}

export default connect(null, actionCreators)(LoginForm)
