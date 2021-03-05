import React from 'react';
import {
  Box,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useLocation, Navigate } from 'react-router-dom';
import { isNull } from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SlackAuthenticationPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const classes = useStyles();
  const query = useQuery();
  const state = query.get('state');
  const code = query.get('code');

  return (
    <>
      {isNull(state) || isNull(code) ? <Navigate to="/404" /> : (
        <Page
          className={classes.root}
          title="Login"
        >
          <Box
            display="flex"
            flexDirection="column"
            height="100%"
            justifyContent="center"
          >
            <Typography>Loading..</Typography>
          </Box>
        </Page>
      )}

    </>
  );
};

export default SlackAuthenticationPage;
