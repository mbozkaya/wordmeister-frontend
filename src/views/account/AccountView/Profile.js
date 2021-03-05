/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  GridList,
  GridListTile,
  GridListTileBar,
  ListSubheader,
  IconButton,
  Grid,
  DialogContentText,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { v4 as uuid } from 'uuid';
import urlConfig from 'src/configs/urlConfig';
import ToasterSnackbar from 'src/components/ToasterSnackbar';
import accountService from 'src/services/accountService';
import Blockui from 'src/components/Blockui';
import appConfig from 'src/configs/appConfig';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  },
  gridList: {
    width: 'max',
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
    transition: ' box-shadow 0.6s linear;',
    '&:hover': {
      transform: 'scale(1.5)',
    },
  },
  input: {
    display: 'none',
  },
  selectedImage: {
    border: 'solid 2px #76f976',
  },
  gridTile: {
    cursor: 'pointer',
    transition: ' box-shadow 0.6s linear;',
    '&:hover': {
      transform: 'scale(1.01)',
    },
  }
}));

const Profile = (props) => {
  const { user, setuser, className } = props;
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [tileData, setTileData] = useState([]);
  const [deleteImageDialog, setDeleteImageDialog] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(0);

  const getUserImages = (CB) => {
    accountService.getUserImages().then((response) => {
      if (response && response.error === false) {
        setTileData(response.data);
        if (CB) {
          const selected = response.data.find((f) => f.selected === true);
          CB(selected);
        }
      } else {
        ToasterSnackbar.error(response.errorMessage);
      }
    });
  };

  const changeLayoutPP = (selected) => {
    const selectedImage = selected || tileData.find((f) => f.selected === true);
    if (selectedImage) {
      setuser(selectedImage.uri);
    }
  };

  const setUserPP = (id) => {
    accountService.setUserImages({ id }).then((response) => {
      if (response && response.error === false) {
        ToasterSnackbar.success({ message: 'Profile picture was setted successfully' });
        changeLayoutPP();
      } else {
        ToasterSnackbar.error({ message: response.errorMessage });
      }
    });
  };

  const removeImage = () => {
    const removedImage = tileData.find((f) => f.id === deleteImageId);
    if (!removedImage) {
      ToasterSnackbar.warning({ message: 'The file could not upload.' });
      return false;
    }
    setDeleteImageDialog(false);
    accountService.removeFile({ id: deleteImageId }).then((response) => {
      if (response && response.error === false) {
        getUserImages();
        ToasterSnackbar.success({ message: 'The image removed successfully' });
      } else {
        ToasterSnackbar.error({ message: response.errorMessage });
      }
    });

    return true;
  };

  useEffect(() => { getUserImages(); }, []);

  const uploadPhoto = () => {
    const selectedImage = tileData.filter((f) => f.selected);
    if (typeof selectedImage === 'undefined' || selectedImage.length === 0) {
      ToasterSnackbar.warning({ message: 'You have to select an image!' });
      return false;
    }

    if (selectedImage[0].isNew && selectedImage[0].isNew === true) {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', selectedImage[0].file);
      formData.append('type', 1);
      formData.append('description', '');
      xhr.open('POST', urlConfig.account.uploadFile, true);
      const userCrendentials = JSON.parse(localStorage.getItem('user'));
      xhr.setRequestHeader('Authorization', `Bearer ${userCrendentials.token}`);
      xhr.send(formData);
      Blockui();
      xhr.onload = () => {
        Blockui({ isOpen: false });
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);
          if (response && response.error === false) {
            getUserImages((selected) => { changeLayoutPP(selected); });
          } else {
            ToasterSnackbar.error({ message: response.errorMessage });
          }
        }
      };
    } else {
      setUserPP(selectedImage[0].id);
    }
    return true;
  };

  return (
    <>
      <Card
        className={clsx(classes.root, className)}
      >
        <CardContent>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Avatar
              className={classes.avatar}
              src={user.avatar}
            />
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h3"
            >
              {user.name}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              {/* {`${user.city} ${user.country}`} */}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              {`${moment().format('hh:mm A')}`}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            fullWidth
            variant="text"
            onClick={() => setOpenDialog(true)}
          >
            Upload picture
          </Button>
        </CardActions>
      </Card>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="form-dialog-title">All Images</DialogTitle>
        <DialogContent>
          <Grid
            container
          >
            <GridList cellHeight={180} className={classes.gridList}>
              <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                <ListSubheader component="div">Images You Uploaded Before</ListSubheader>
              </GridListTile>
              {tileData.length === 0 ? <p>No image found</p> : (tileData.map((tile, index) => (
                <GridListTile
                  key={`${tile.uri}${index}`}
                  className={`${classes.gridTile} ${tile.selected && classes.selectedImage}`}
                  onClick={() => {
                    tileData.forEach((f) => { f.selected = false; });
                    tileData[tileData.findIndex((f) => f.id === tile.id)] = {
                      ...tile,
                      selected: true,
                    };
                    setTileData([...tileData]);
                  }}
                >
                  <img src={`${tile.isNew ? '' : appConfig.api.development}${tile.uri}`} alt={tile.title} />
                  <GridListTileBar
                    title={tile.title}
                    subtitle={(
                      <span>
                        {tile.createdDate}
                      </span>
                    )}
                    actionIcon={(
                      <IconButton
                        aria-label={`info about ${tile.title}`}
                        className={classes.icon}
                        title=""
                        onClick={() => {
                          setDeleteImageId(tile.id);
                          setDeleteImageDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  />
                </GridListTile>
              )))}
            </GridList>
            <Grid item>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={(image) => {
                  const { target: { files } } = image;

                  if (files.length < 1) {
                    return false;
                  }
                  tileData[tileData.length] = {
                    isNew: true,
                    title: files[0].name,
                    selected: false,
                    id: uuid(),
                    file: files[0],
                  };

                  setTileData([...tileData]);

                  const fr = new FileReader();
                  fr.onload = (e) => {
                    const uri = e.target.result;
                    tileData[tileData.length - 1] = {
                      ...tileData[tileData.length - 1],
                      uri,
                    };
                    setTileData([...tileData]);
                  };
                  fr.readAsDataURL(files[0]);

                  return true;
                }}
                onClick={() => { }}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  Select New Image
                </Button>
              </label>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={uploadPhoto} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteImageDialog} onClose={() => setDeleteImageDialog(false)} aria-labelledby="image-dialog-title" maxWidth="xs">
        <DialogTitle id="image-dialog-title">
          <DialogContentText>
            Are you sure to remove image?
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => setDeleteImageDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={removeImage} color="primary">
              Remove
            </Button>
          </DialogActions>
        </DialogTitle>
      </Dialog>
    </>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
  setuser: PropTypes.func.isRequired,
};

export default Profile;
