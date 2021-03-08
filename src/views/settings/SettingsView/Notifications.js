import React, { useState } from 'react';
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
    isEnable: false,
    hour: '23',
    minute: '00',
  });
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
                          checked={notificationData.isEnable}
                          onChange={() => setNotificationData({
                            ...notificationData,
                            isEnable: !notificationData.isEnable,
                          })}
                          name="checkedB"
                          color="primary"
                        />
                      )}
                      label="Email"
                    />
                  </Grid>
                  {
                    notificationData.isEnable && (
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
                              hour: hour < 10 ? `0${hour}` : hour.toString(),
                              minute: minute < 10 ? `0${minute}` : minute.toString(),
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
              onClick={() => setOpen(true)}
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
              notificationData.isEnable
                ? `You will start to receive mail notification on next day ${notificationData.hour}:${notificationData.minute}.`
                : 'Your notification settings will be removed.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)} color="default">
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} color="primary" autoFocus>
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
