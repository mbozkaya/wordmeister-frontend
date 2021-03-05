import { Fetch } from '../components/Fetch';
import urlConfig from '../configs/urlConfig';
import utilitity from '../configs/utilitiy';

export default {
  login: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model),
    };

    return Fetch(urlConfig.account.login, requestOptions);
  },
  signup: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model)
    };

    return Fetch(urlConfig.account.signup, requestOptions);
  },
  authenticated: () => {
    const requestOptions = {
      method: 'GET',
      headers: utilitity.authorizedHeader(),
    };

    return fetch(urlConfig.account.authenticated, requestOptions)
      .then((response) => {
        if (response.ok) {
          return true;
        }
        if (response.status === 401) {
          localStorage.removeItem('user');
        } else {
          throw new Error();
        }
        return false;
      })
      .then((json) => {
        return json;
      })
      .catch((ex) => {
        console.error(ex);
        return false;
      });
  },
  accountInformation: () => {
    const requestOptions = {
      method: 'GET',
      headers: utilitity.authorizedHeader(),
    };

    return Fetch(urlConfig.account.accountInformation, requestOptions);
  },
  getUserImages: () => {
    const requestOptions = {
      method: 'GET',
      headers: utilitity.authorizedHeader(),
    };

    return Fetch(urlConfig.account.userImages, requestOptions);
  },
  setUserImages: (model) => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(model),
      headers: utilitity.authorizedHeader(),
    };

    return Fetch(urlConfig.account.userProfilePic, requestOptions);
  },
  removeFile: (model) => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(model),
      headers: utilitity.authorizedHeader(),
    };

    return Fetch(urlConfig.account.removeFile, requestOptions);
  },
  updateInformation: (model) => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(model),
      headers: utilitity.authorizedHeader()
    }
    return Fetch(urlConfig.account.updateInformation, requestOptions);
  },
  updatePassword: (model) => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(model),
      headers: utilitity.authorizedHeader()
    }

    return Fetch(urlConfig.account.updatePassword, requestOptions);
  }
};
