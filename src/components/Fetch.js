import PropTypes from 'prop-types';
import Blockui from './Blockui';
import ToasterSnackbar from './ToasterSnackbar';
// eslint-disable-next-line import/prefer-default-export
export const Fetch = (url, requestOptions) => {
  Blockui();
  return (fetch(url, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      if (response.status === 401) {
        localStorage.removeItem('user');
        if (window.location.pathname !== '/') window.location = '/';
      }
      if (response.status === 400) {
        return response.json();
      }
      throw new Error();
    })
    .then((json) => {
      Blockui({ isOpen: false });
      return json;
    })
    .catch((ex) => {
      Blockui({ isOpen: false });
      ToasterSnackbar.error({ message: 'An error occured' });
      console.error(ex);
      return false;
    })
  );
};

Fetch.propTypes = {
  url: PropTypes.string.isRequired,
  requestOptions: PropTypes.object.isRequired,
};
