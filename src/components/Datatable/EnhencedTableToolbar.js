/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { AddIcon } from '@material-ui/data-grid';
import {
  Container, Drawer, TextField, Box, Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@material-ui/core';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
  textField: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
      height: '10ch'
    },
  },
  margin: {
    margin: theme.spacing(0),
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected, title, drawerOpen, drawerData, onDrawerClose,
    onDrawerUpdate, dialogOnSubmit, DialogName, DialogDescription,
    confirmationDialogSubmit, confirmationDialogSubmitText,
    selectedData, addButtonDisable, columns, filterButtonDisable
  } = props;

  const [updateData, setUpdateData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  useEffect(() => {
    if (Object.keys(drawerData).length > 0 && drawerData.constructor === Object) {
      setUpdateData(drawerData);
    }
  }, [drawerData]);

  useEffect(() => setDialogData(''), [dialogOpen]);
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected}
          {' '}
          selected
        </Typography>
      )
        : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
        )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={() => setConfirmationDialog(true)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )
        : (
          <>
            {
              filterButtonDisable && (
              <Tooltip title="Filter list">
                <IconButton aria-label="filter list">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              )
            }
            {addButtonDisable && (
              <Tooltip title="Add Item">
                <IconButton
                  aria-label="add-icon"
                  onClick={() => setDialogOpen(true)}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      <Drawer anchor="right" open={drawerOpen} onClose={onDrawerClose}>
        <Container>
          <Box mt={3}>
            <form className={classes.textField} noValidate autoComplete="off">
              {
                Array(columns).length > 0 && Object.keys(drawerData).length > 0 && (
                  columns.filter((f) => f.show === true).map((col, index) => (
                    <div key={`ett${index}`}>
                      <TextField
                        label={col.label}
                        value={updateData[col.id]}
                        onChange={(el) => {
                          const stateData = { ...updateData };
                          stateData[col.id] = el.target.value;
                          setUpdateData(stateData);
                        }}
                        disabled={!col.edittable}
                        key={`textfieldEdit${col.id}${index}`}
                      />
                    </div>
                  ))
                )
              }
              <div>
                <Button variant="contained" size="small" color="primary" className={classes.margin} onClick={() => onDrawerUpdate(updateData)}>
                  Update
                </Button>
              </div>
            </form>
          </Box>
        </Container>
      </Drawer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{DialogName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {DialogDescription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(false);
              dialogOnSubmit(dialogData);
            }}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmationDialog}
        onClose={() => setConfirmationDialog(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Do you want to delete ${numSelected === 1 ? 'this one selected item' : `these ${numSelected} items`}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setConfirmationDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConfirmationDialog(false);
              confirmationDialogSubmit(selectedData);
            }}
            color="primary"
            autoFocus
          >
            {confirmationDialogSubmitText}
          </Button>
        </DialogActions>
      </Dialog>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  drawerOpen: PropTypes.bool,
  drawerData: PropTypes.object,
  onDrawerClose: PropTypes.func,
  onDrawerUpdate: PropTypes.func,
  dialogOnSubmit: PropTypes.func,
  DialogName: PropTypes.string,
  DialogDescription: PropTypes.string,
  confirmationDialogSubmit: PropTypes.func,
  confirmationDialogSubmitText: PropTypes.string,
  selectedData: PropTypes.array,
  addButtonDisable: PropTypes.bool,
  columns: PropTypes.array,
  filterButtonDisable: PropTypes.bool,
};

EnhancedTableToolbar.defaultProps = {
  drawerOpen: false,
  drawerData: {},
  onDrawerClose: () => console.log('closed'),
  onDrawerUpdate: (data) => console.log(data),
  dialogOnSubmit: (model) => console.log(model),
  DialogName: '',
  DialogDescription: '',
  confirmationDialogSubmit: () => console.log('confirmation dialog submit'),
  confirmationDialogSubmitText: 'Delete',
  selectedData: [],
  addButtonDisable: false,
  columns: [],
  filterButtonDisable: false,
};

export default EnhancedTableToolbar;
