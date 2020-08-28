import React, { useState } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import CenteredFlexBoxWithBorder from '../../CenteredFlexBoxWithBorder'
import CoolButton from '../../CoolButton'
import { Register } from '../../../store/actions/Auth'

const INITIAL_FORM_STATE = {
  email: '',
  password: '',
  cpassword: ''
}

const RegisterForm = ({ register }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE)
  const history = useHistory()

  const handleFormFieldChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <CenteredFlexBoxWithBorder>
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>
      <Formik
        initialValues={{
          email: INITIAL_FORM_STATE.email,
          password: INITIAL_FORM_STATE.password,
          cpassword: INITIAL_FORM_STATE.cpassword
        }}
        onSubmit={(values, actions) => {
          register({
            registerForm: { email: values.email, password: values.password },
            history
          })
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Field should contain valid email.')
            .required('Please, enter email.'),
          password: Yup.string()
            .min(6, 'Password should at least 6 characters long.')
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
            <Box display="flex" justifyContent="center" m={1}>
              <CoolButton color="blue" type="submit">
                Register
              </CoolButton>
            </Box>
          </FormikForm>
        )}
      </Formik>
      <Link to="/login">Already have an account?</Link>
    </CenteredFlexBoxWithBorder>
  )
}

RegisterForm.propTypes = {
  register: PropTypes.func.isRequired
}

const actionCreators = {
  register: Register
}

export default connect(null, actionCreators)(RegisterForm)
