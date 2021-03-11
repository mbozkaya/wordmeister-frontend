import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import accountService from 'src/services/accountService';
import ToasterSnackbar from 'src/components/ToasterSnackbar';
import Constants from 'src/helpers/Constants';

const useStyles = makeStyles((theme) => ({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const Notifications = ({ className, ...rest }) => {
  const classes = useStyles();
  const [notificationData, setNotificationData] = useState({
    hour: '23',
    minute: '00',
    enable: false,
  });
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const getCorrectFormat = (value) => (value < 10 ? `0${value}` : value.toString());

  const getSettings = () => {
    accountService.getSettings().then((response) => {
      if (response && response.error === false) {
        const { data: { mailSetting, minute, hour } } = response;
        setNotificationData({
          ...notificationData,
          hour: getCorrectFormat(hour),
          minute: getCorrectFormat(minute),
          enable: mailSetting,
        });
      } else {
        ToasterSnackbar.error(response.errorMessage || 'An error occured');
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getSettings(); }, []);

  return (
    <>
      <form
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Card>
          <CardHeader
            title="Notifications"
            subheader="Manage the notifications"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid
                className={classes.item}
                item
                md={4}
                sm={6}
                xs={12}
              >
                <Grid container spacing={2}>
                  <Grid
                    className={classes.item}
                    item
                    md={6}
                    sm={6}
                    xs={12}
                  >
                    <FormControlLabel
                      control={(
                        <Switch
                          onChange={() => {
                            setNotificationData({
                              ...notificationData,
                              enable: !notificationData.enable,
                            });
                          }}
                          name="checkedB"
                          color="primary"
                          checked={notificationData.enable}
                        />
                      )}
                      label="Email"
                    />
                  </Grid>
                  {
                    notificationData.enable && (
                      <Grid
                        className={classes.item}
                        item
                        md={6}
                        sm={6}
                        xs={12}
                      >
                        <TextField
                          id="time"
                          label="Notification Clock"
                          type="time"
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 900, // 5 min
                          }}
                          onChange={(el) => {
                            const { target: { value } } = el;
                            const hour = parseInt(value.split(':')[0], 10);
                            const minute = parseInt(value.split(':')[1], 10);
                            setNotificationData({
                              ...notificationData,
                              hour: getCorrectFormat(hour),
                              minute: getCorrectFormat(minute),
                            });
                          }}
                          value={`${notificationData.hour}:${notificationData.minute}`}
                        />
                      </Grid>
                    )
                  }
                </Grid>
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
              onClick={() => {
                if (notificationData.enable
                  // eslint-disable-next-line eqeqeq
                  && (notificationData.hour == 0 || notificationData.minute == 0)) {
                  ToasterSnackbar.warning({ message: 'Please enter valid hour and minute' });
                } else {
                  setOpen(true);
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Card>
      </form>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>Do you confirm the following message?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              notificationData.enable
                ? `You will start to receive mail notification on next day ${notificationData.hour}:${notificationData.minute}.`
                : 'Your notification settings will be removed.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)} color="default">
            Cancel
          </Button>
          <Button
            onClick={() => {
              const model = {
                userSettings: [{
                  type: Constants.userSettingType.mailNotification,
                  enable: notificationData.enable,
                }],
                hour: parseInt(notificationData.hour, 10),
                minute: parseInt(notificationData.minute, 10),
              };
              accountService.updateSettings(model).then((response) => {
                if (response && response.error === false) {
                  setOpen(false);
                  getSettings();
                } else {
                  ToasterSnackbar.error({ message: response.errorMessage || 'An error occured' });
                }
              });
            }}
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Notifications.propTypes = {
  className: PropTypes.string
};

export default Notifications;
