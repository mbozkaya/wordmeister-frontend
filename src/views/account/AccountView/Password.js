import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
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

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiAccordionDetails-root': {
      display: 'flex',
      flexDirection: 'column',
      padding: '8px 16px 16px'
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

const Password = () => {
  const classes = useStyles();

  const ValidateSchema = Yup.object().shape({
    oldPassword: Yup.string().required('This field is required'),
    newPassword: Yup.string().when('oldPassword', {
      is: (val) => (!!(val && val.length > 0)),
      then: Yup.string()
        .required('This field is required')
        .notOneOf(
          [Yup.ref('oldPassword')],
          'The new password must be different.'
        )
    }),
    confirmNewPassword: Yup.string().when('newPassword', {
      is: (val) => (!!(val && val.length > 0)),
      then: Yup.string().oneOf([Yup.ref('newPassword')], 'Both new password field must be same')
    }),
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
        </AccordionSummary>
        <AccordionDetails>
          <Formik
            initialValues={{
              oldPassword: '',
              newPassword: '',
              confirmNewPassword: '',
            }}
            validationSchema={ValidateSchema}
            onSubmit={(model, { resetForm }) => {
              accountService.updatePassword(model).then((response) => {
                if (response && response.error === false) {
                  ToasterSnackbar.success({ message: 'Password change has successful!' });
                  resetForm({});
                } else {
                  ToasterSnackbar.error({ message: response.errorMessage || 'An error occured' });
                }
              });
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
                      <TextField
                        error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                        fullWidth
                        helperText={touched.confirmNewPassword && errors.confirmNewPassword}
                        label="Confirm New Password"
                        margin="normal"
                        name="confirmNewPassword"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.confirmNewPassword}
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
              );
            }}

          </Formik>
        </AccordionDetails>
      </Accordion>

    </div>
  );
};

export default Password;
