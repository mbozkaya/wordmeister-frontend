import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Route, Navigate
} from 'react-router-dom';
import appConfig from 'src/configs/appConfig';
import accountService from '../services/accountService';
// import Login from '../pages/Login';
// eslint-disable-next-line linebreak-style

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const getUserPP = () => `${appConfig.api.development}${localStorage.getItem('userpp') || 'Files/PP/default.png'}`;

  const [contextState, setContextState] = useState({
    authorize: false,
    checkAuth: false,
    permission: 0,
    loginError: false,
    loginErrorMessage: '',
    signupError: false,
    signupErrorMessage: '',
    backdropOpen: false,
    user: {
      avatar: getUserPP(),
      jobTitle: '',
      name: ''
    },
  });

  const setUserPP = (avatar) => {
    localStorage.setItem('userpp', avatar);
    setContextState({
      ...contextState,
      user: {
        ...contextState.user,
        avatar: getUserPP(),
      }
    });
  };
  const { children } = props;

  const onLogin = (model) => {
    accountService.login(model).then((response) => {
      if (response && response.error === false) {
        const { data } = response;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('userpp', data.avatar);
        setContextState({
          authorize: true,
          loginError: false,
          loginErrorMessage: '',
          checkAuth: true,
          user: {
            avatar: `${appConfig.api.development}${data.avatar}`,
            name: `${data.firstName} ${data.lastName}`,
            jobTitle: '',
          },
        });
      } else {
        setContextState({
          ...contextState,
          loginError: true,
          loginErrorMessage: response.message || 'Api not found',
        });
      }
    });
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setContextState({
      authorize: false,
      permission: 0,
      checkAuth: true,
    });
  };

  const onSignup = (model) => {
    if (model === null) { return; }

    accountService.signup(model).then((response) => {
      if (response && response.error === false) {
        // signup basarili ise authorize'de olacak
        setContextState({
          // ...this.state,
          // authorize:true,
          // email:model.email
          signupError: false,
        });
        onLogin(model);
      } else {
        setContextState({
          // ...this.state,
          signupError: true,
          signupErrorMessage: response.errorMessage
        });
      }
    });
  };

  useLayoutEffect(() => {
    accountService.authenticated().then((response) => {
      setContextState({
        ...contextState,
        authorize: response,
        checkAuth: true,
        permission: 0,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authorize: contextState.authorize,
        checkAuth: contextState.checkAuth,
        loginError: contextState.loginError,
        loginErrorMessage: contextState.loginErrorMessage,
        user: contextState.user,
        onLogin,
        onLogout,
        onSignup,
        setUserPP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthRoute = ({ Component, ...rest }) => (
  <AuthContext.Consumer>
    {({ authorize, checkAuth }) => {
      let content = '';
      if (authorize) {
        content = (
          <Route
            render={(props) => (
              <Component {...props} />
            )}
            {...rest}
          />
        );
      } else if (checkAuth && !authorize) {
        content = <Navigate to="/" />;
      }
      return content;
    }}
  </AuthContext.Consumer>
);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

AuthRoute.propTypes = {
  Component: PropTypes.instanceOf(<></>).isRequired,
};

export {
  AuthContext, AuthProvider, AuthRoute,
};
