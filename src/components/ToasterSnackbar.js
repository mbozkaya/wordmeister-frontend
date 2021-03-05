/* eslint-disable react/no-find-dom-node */
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const messageType = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'success',
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const ShowSnackbar = (props) => {
  const {
    type, autoClose, timeout, message, onCloseCB
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const interval = useRef(null);
  useEffect(() => {
    if (autoClose) {
      interval.current = setTimeout(() => {
        handleClose();
        if (onCloseCB) onCloseCB();
        ReactDOM.unmountComponentAtNode(document.getElementById('snackbar'));
      }, timeout * 1000);
    }
  }, []);

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={timeout * 1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

ShowSnackbar.propTypes = {
  type: PropTypes.oneOf(['error', 'success', 'info', 'warning']),
  autoClose: PropTypes.bool,
  timeout: PropTypes.number,
  message: PropTypes.string,
  onCloseCB: PropTypes.func,
};

ShowSnackbar.defaultProps = {
  type: messageType.error,
  autoClose: true,
  timeout: 3,
  message: '',
  onCloseCB: () => { },
};

export default {
  error: (props) => { ReactDOM.render(<ShowSnackbar type="error" {...props} />, document.getElementById('snackbar')); },
  success: (props) => { ReactDOM.render(<ShowSnackbar type="success" {...props} />, document.getElementById('snackbar')); },
  warning: (props) => { ReactDOM.render(<ShowSnackbar type="warning" {...props} />, document.getElementById('snackbar')); },
  info: (props) => { ReactDOM.render(<ShowSnackbar type="info" {...props} />, document.getElementById('snackbar')); },
};
