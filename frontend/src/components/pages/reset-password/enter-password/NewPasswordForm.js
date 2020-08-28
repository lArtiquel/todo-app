import React, { useState } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import CoolButton from '../../../CoolButton'
import CenteredFlexBoxWithBorder from '../../../CenteredFlexBoxWithBorder'
import { ResetPassword } from '../../../../store/actions/Auth'

const INIT_FORM_STATE = { password: '', cpassword: '' }

const NewPasswordForm = ({ resetPassword }) => {
  const history = useHistory()
  const location = useLocation()
  const [form, setForm] = useState(INIT_FORM_STATE)

  const handleFormFieldChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <CenteredFlexBoxWithBorder>
      <Typography variant="h5" align="center" gutterBottom>
        Enter new password
      </Typography>
      <Formik
        initialValues={{
          password: INIT_FORM_STATE.password,
          cpassword: INIT_FORM_STATE.cpassword
        }}
        onSubmit={(values, actions) => {
          resetPassword({ location, newPassword: values.password, history })
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .min(6, 'Password should be at least 6 characters long.')
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
              label="New Password"
              name="password"
              variant="outlined"
              type="password"
              autoFocus
              margin="dense"
              fullWidth
              error={errors.password && touched.password}
              helperText={
                errors.password && touched.password ? errors.password : ''
              }
            />
            <Field
              as={TextField}
              label="Confirm New Password"
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
                Set new password
              </CoolButton>
            </Box>
          </FormikForm>
        )}
      </Formik>
    </CenteredFlexBoxWithBorder>
  )
}

NewPasswordForm.propTypes = {
  resetPassword: PropTypes.func.isRequired
}

const actionCreators = {
  resetPassword: ResetPassword
}

export default connect(null, actionCreators)(NewPasswordForm)
