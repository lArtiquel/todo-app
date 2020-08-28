import React, { useState } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CoolButton from '../../../CoolButton'
import CenteredFlexBoxWithBorder from '../../../CenteredFlexBoxWithBorder'
import { ResetPasswordForEmail } from '../../../../store/actions/Auth'

const EmailForm = ({ resetPasswordForEmail }) => {
  const [email, setEmail] = useState('')

  return (
    <CenteredFlexBoxWithBorder>
      <Typography variant="h5" align="center" gutterBottom>
        Enter email
      </Typography>
      <Formik
        initialValues={{
          email
        }}
        onSubmit={(values, actions) => {
          resetPasswordForEmail({ email })
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Field should contain valid email.')
            .required('Email is required.')
        })}
        validateOnChange
        validateOnBlur
      >
        {({ errors, touched }) => (
          <FormikForm onChange={(e) => setEmail(e.target.value)}>
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
            <Box display="flex" justifyContent="center" m={1}>
              <CoolButton color="blue" type="submit">
                Reset password
              </CoolButton>
            </Box>
          </FormikForm>
        )}
      </Formik>
      <Box my={1} display="flex" justifyContent="center">
        <Link to="/login">Remember password?</Link>
      </Box>
    </CenteredFlexBoxWithBorder>
  )
}

EmailForm.propTypes = {
  resetPasswordForEmail: PropTypes.func.isRequired
}

const actionCreators = {
  resetPasswordForEmail: ResetPasswordForEmail
}

export default connect(null, actionCreators)(EmailForm)
