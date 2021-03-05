import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { AuthProvider } from './contexts/authContext';

const App = () => {
  const routing = useRoutes(routes);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>
      <div id="snackbar" />
      <div id="blockui" />
    </AuthProvider>
  );
};

export default App;
