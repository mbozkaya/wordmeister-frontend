import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { AuthContext } from 'src/contexts/authContext';
import NavBar from './NavBar';
import TopBar from './TopBar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <AuthContext.Consumer>
      {({ authorize, checkAuth, user }) => {
        if (checkAuth && authorize) {
          return (
            <div className={classes.root}>
              <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
              <NavBar
                onMobileClose={() => setMobileNavOpen(false)}
                openMobile={isMobileNavOpen}
                user={user}
              />
              <div className={classes.wrapper}>
                <div className={classes.contentContainer}>
                  <div className={classes.content}>
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          );
        } if (checkAuth && !authorize) {
          return <Navigate to="/login" />;
        }
        return null;
      }}
    </AuthContext.Consumer>

  );
};

export default DashboardLayout;
