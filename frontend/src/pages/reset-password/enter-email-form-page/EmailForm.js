import React, { useState } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import stringify from 'qs-stringify'
import CoolButton from '../../../components/CoolButton'
import axios from '../../../config/axios'

const LoginForm = ({ setLoading, setDialogInfo }) => {
  const [email, setEmail] = useState('')

  const sendResetPasswordMail = async () => {
    setLoading(true)
    try {
      const response = await axios({
        url: '/api/auth/reset-password-for-email',
        method: 'post',
        params: stringify({ email })
      })
      setDialogInfo({
        isActive: true,
        header: 'Success',
        message: response.data.message
      })
    } catch (error) {
      setDialogInfo({
        isActive: true,
        header: 'Success',
        message: error.data.message
      })
    }
    setLoading(false)
  }

  return (
    <Box m={2}>
      <Typography variant="h5" align="center" gutterBottom>
        Enter email
      </Typography>
      <Formik
        initialValues={{
          email
        }}
        onSubmit={(values, actions) => {
          sendResetPasswordMail()
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
            <Box display="flex" justifyContent="center">
              <CoolButton color="blue" type="submit">
                Reset password
              </CoolButton>
            </Box>
          </FormikForm>
        )}
      </Formik>
      <Link to="/login">Remember password?</Link>
    </Box>
  )
}

LoginForm.propTypes = {
  setLoading: PropTypes.func.isRequired,
  setDialogInfo: PropTypes.func.isRequired
}
