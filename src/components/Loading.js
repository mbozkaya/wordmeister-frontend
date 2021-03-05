import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = `
  display: block;
  margin: 0 auto;
  border-color: red;
`;

// eslint-disable-next-line import/prefer-default-export
export const loading = () => {
  return typeof (document.getElementById('sweet-loading')) !== 'undefined' && document.getElementById('sweet-loading') != null ? (
    document.getElementById('sweet-loading').remove()
  )
    : (
      <div className="sweet-loading" id="sweet-loading">
        <ClipLoader
          css={override}
          size={150}
          color="#123abc"
          loading
        />
      </div>
    );
};
