import * as React from 'react';
import { DataGrid as DG } from '@material-ui/data-grid';
import PropTypes from 'prop-types';

const DataGrid = (props) => {
  const { data, columns } = props;
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DG
        columns={columns}
        rows={data}
      />
    </div>
  );
};

DataGrid.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.object),
};

DataGrid.DefaultPropTypes = {
  data: [],
  columns: [{ field: 'Loading' }],
};

export default DataGrid;
