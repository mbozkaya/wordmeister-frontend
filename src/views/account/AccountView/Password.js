import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles
} from '@material-ui/core';
import accountService from 'src/services/accountService';
import ToasterSnackbar from 'src/components/ToasterSnackbar';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Type } from 'react-feather';




const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiAccordionDetails-root": {
      display:"flex",
      flexDirection: "column", 
      padding: "8px 16px 16px"
    }
  },
  accordionRoot: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  }  
}));

const Password = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    OldPassword: '',
    NewPassword: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const ValidateSchema = Yup.object().shape({
    oldPassword: Yup.string().required("This field is required"),
    newPassword: Yup.string().when("oldPassword", {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string()
        .required("This field is required")
        .notOneOf(
          [Yup.ref("oldPassword")],
          "The new password must be different."
        )
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        )
    })
  });

  const [expanded, setExpanded] = React.useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (

    <div className={classes.root}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Password</Typography>
          <Typography className={classes.secondaryHeading}>Update Password</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Formik
              initialValues={{
                oldPassword: '',
                newPassword: ''
              }}
              validationSchema={ValidateSchema}
              onSubmit={(model,{resetForm}) => {
                accountService.updatePassword(model).then((response) => {
                  if (response && response.error === false) {
                    ToasterSnackbar.success({ message: "Password change has successful!" });
                    resetForm({});
                  }
                  else {
                    ToasterSnackbar.error({ message: response.errorMessage || 'An error occured' });
                  }
                })
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values
              }) => {
                return (
                  <form
                    onSubmit={handleSubmit}
                  >
                    <Card>
                      {/* <CardHeader
                subheader="Update password"
                title="Password"
              />
              <Divider /> */}
                      <CardContent>
                        <TextField
                          error={Boolean(touched.oldPassword && errors.oldPassword)}
                          fullWidth
                          helperText={touched.oldPassword && errors.oldPassword}
                          label="Current Password"
                          margin="normal"
                          name="oldPassword"
                          required
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="password"
                          value={values.oldPassword}
                          variant="outlined"
                        />
                        <TextField
                          error={Boolean(touched.newPassword && errors.newPassword)}
                          fullWidth
                          helperText={touched.newPassword && errors.newPassword}
                          label="New Password"
                          margin="normal"
                          name="newPassword"
                          required
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="password"
                          value={values.newPassword}
                          variant="outlined"
                        />
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
                          Update
          </Button>
                      </Box>
                    </Card>
                  </form>
                )
              }
              }

            </Formik>
        </AccordionDetails>
      </Accordion>

    </div>
  )




  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: ''
      }}
      validationSchema={ValidateSchema}
      onSubmit={(model) => {
        accountService.updatePassword(model).then((response) => {
          if (response && response.error === false) {
            ToasterSnackbar.success({ message: "Password change has successful!" })
          }
          else {
            ToasterSnackbar.error({ message: response.errorMessage || 'An error occured' });
          }
        })
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        values
      }) => {
        return (
          <form
            onSubmit={handleSubmit}
          >
            <Card>
              <CardHeader
                subheader="Update password"
                title="Password"
              />
              <Divider />
              <CardContent>
                <TextField
                  error={Boolean(touched.oldPassword && errors.oldPassword)}
                  fullWidth
                  helperText={touched.oldPassword && errors.oldPassword}
                  label="Current Password"
                  margin="normal"
                  name="oldPassword"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.oldPassword}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  fullWidth
                  helperText={touched.newPassword && errors.newPassword}
                  label="New Password"
                  margin="normal"
                  name="newPassword"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.newPassword}
                  variant="outlined"
                />
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
                  Update
          </Button>
              </Box>
            </Card>
          </form>
        )
      }
      }

    </Formik>

  )

};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
