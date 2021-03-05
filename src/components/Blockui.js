import React, { useEffect, useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import ReactDOM from 'react-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Blockui = (props) => {
  const { isOpen } = props;
  const [open, setOpen] = useState(isOpen);
  const classes = useStyles();
  useEffect(() => { setOpen(isOpen); }, [isOpen]);
  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

Blockui.propTypes = {
  isOpen: PropTypes.bool,
};

Blockui.defaultProps = {
  isOpen: true,
};

export default (props) => { ReactDOM.render(<Blockui {...props} />, document.getElementById('blockui')); };
