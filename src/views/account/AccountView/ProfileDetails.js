import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@material-ui/core';
import accountService from 'src/services/accountService';
import ToasterSnackbar from 'src/components/ToasterSnackbar';

const ProfileDetails = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    imageUri: '',
  });

  const getAccountInformation = () => {
    accountService.accountInformation().then((response) => {
      if (response && response.error === false) {
        const { data } = response;
        setProfileData({
          ...profileData,
          firstName: data.firstname,
          lastName: data.lastname,
          email: data.email,
          imageUri: data.pictureUri,
        });
      }
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getAccountInformation(); }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...profileData
      }}
      validationSchema={
        Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          firstName: Yup.string().max(255).required('First name is required'),
          lastName: Yup.string().max(255).required('Last name is required')
        })
      }
      onSubmit={(model) => {
        accountService.updateInformation(model).then((response) => {
          if (response && response.error === false) {
            ToasterSnackbar.success({ message: 'Information change has successful!' });
          } else {
            ToasterSnackbar.error({ message: response.errorMessage || 'An error occured' });
          }
        });
      }}
    >

      {
        ({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          values
        }) => {
          return (
            <form
              // type="post"
              onSubmit={handleSubmit}
              // autoComplete="off"
              // noValidate
              // className={clsx(classes.root, className)}
              // {...rest}
            >
              <Card>
                <CardHeader
                  subheader="The information can be edited"
                  title="Profile"
                />
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.firstName && errors.firstName)}
                        fullWidth
                        helperText={touched.firstName && errors.firstName}
                        label="First name"
                        name="firstName"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.lastName && errors.lastName)}
                        fullWidth
                        helperText={touched.lastName && errors.lastName}
                        label="Last name"
                        name="lastName"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.lastName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label="Email Address"
                        name="email"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  p={2}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                  >
                    Save details
                  </Button>
                </Box>
              </Card>
            </form>
          );
        }
      }
    </Formik>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
