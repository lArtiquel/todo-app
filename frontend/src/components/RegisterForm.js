import React, { useState } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import CoolButton from './CoolButton'
import { RegisterAction } from '../store/actions/authActions'

const INITIAL_FORM_STATE = {
  email: '',
  password: '',
  cpassword: ''
}

const RegisterForm = ({ register }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE)

  const handleFormFieldChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Box m={2}>
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>
      <Formik
        initialValues={{
          email: form.email,
          password: form.password,
          cpassword: form.cpassword
        }}
        onSubmit={(values, actions) => {
          // try to register
          register({ email: values.email, password: values.password })
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Field should contain valid email.')
            .required('Please, enter email.'),
          password: Yup.string()
            .min(6, 'Password should contain at least 6 characters.')
            .required('Password is required.'),
          cpassword: Yup.string()
            .test('match', 'Passwords do not match.', function (cpassword) {
              return cpassword === form.password
            })
            .required('Confirm password is required.')
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
            <Field
              as={TextField}
              label="Confirm password"
              name="cpassword"
              variant="outlined"
              type="password"
              margin="dense"
              fullWidth
              error={errors.cpassword && touched.cpassword}
              helperText={
                errors.cpassword && touched.cpassword ? errors.cpassword : ''
              }
            />
            <Box display="flex" justifyContent="center">
              <CoolButton color="blue" type="submit">
                Register
              </CoolButton>
            </Box>
          </FormikForm>
        )}
      </Formik>
      <Link to="/login">Already have an account?</Link>
    </Box>
  )
}

RegisterForm.propTypes = {
  register: PropTypes.func.isRequired
}

const mapActionsToProps = (dispatch) => {
  return {
    register: (registerForm) => dispatch(RegisterAction(registerForm))
  }
}

export default connect(null, mapActionsToProps)(RegisterForm)
