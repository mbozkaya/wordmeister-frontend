/* eslint-disable no-unused-expressions */
import React, { useEffect } from 'react';
import { RequestContext } from 'src/contexts/requestContext';
import PropTypes from 'prop-types';

const Requester = (props) => {
  const { activity, setter } = props;
  useEffect(() => { });
  (
    <RequestContext.Consumer>
      {({ setRequestActivity }) => { setter && setRequestActivity(activity); }}
    </RequestContext.Consumer>
  );

  return null;
};

Requester.propTypes = {
  activity: PropTypes.bool,
  setter: PropTypes.bool,
};

Requester.defaultPropTypes = {
  activity: false,
  setter: false,
};

export default Requester;
