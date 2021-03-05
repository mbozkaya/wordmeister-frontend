import React from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { AuthContext } from 'src/contexts/authContext';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import Password from './Password';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = () => {
  const classes = useStyles();

  return (
    <AuthContext.Consumer>
      {({ user, setUserPP }) => {
        return (
          <Page
            className={classes.root}
            title="Account"
          >
            <Container maxWidth="lg">
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  lg={4}
                  md={6}
                  xs={12}
                >
                  <Profile user={user} setuser={setUserPP} />
                </Grid>
                <Grid
                  item
                  lg={8}
                  md={6}
                  xs={12}
                >
                  <ProfileDetails />
                  <Box mt={3}>
                    <Password />
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Page>
        );
      }}
    </AuthContext.Consumer>

  );
};

export default Account;
