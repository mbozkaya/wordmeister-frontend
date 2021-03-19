/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import common from 'src/helpers/common';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '@material-ui/core';
import EnhancedTableHead from './EnhencedTableHead';
import EnhancedTableToolbar from './EnhencedTableToolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const DataTable = (props) => {
  const {
    defaultRowsPerPage, columns,
    rowEdit, insertNewRow, removeRow, getData, getDataFlag
  } = props;

  const defaultOrder = common.getDatatableOrder();

  const classes = useStyles();
  const [data, setData] = useState([]);
  const [order, setOrder] = React.useState(defaultOrder.order);
  const [orderBy, setOrderBy] = React.useState(defaultOrder.orderBy);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const dense = false;
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRow, setEditRow] = useState({});
  const [pagingParam, setPagingParam] = useState({
    pageSize: rowsPerPage,
    pageCount: page,
    order,
    orderBy,
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPagingParam({
      ...pagingParam,
      orderBy: property,
      order: isAsc ? 'desc' : 'asc',
    });
    defaultOrder.order = isAsc ? 'desc' : 'asc';
    defaultOrder.orderBy = property;
    common.setDatatableFilter(defaultOrder);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._uuid);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    if (event.target.classList.value.toLowerCase().includes('button')) return;
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const resetSelected = () => {
    const reselected = [];
    selected.map((m) => data.filter((f) => f._uuid === m).length > 0 && reselected.push(m));
    setSelected(reselected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPagingParam({
      ...pagingParam,
      pageCount: newPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    setPage(0);
    setPagingParam({
      ...pagingParam,
      pageSize: newPageSize,
      pageCount: 0,
    });
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const getRegister = () => getData(pagingParam).then((response) => {
    if (response && response.error === false) {
      const newData = response.data.data;
      const { total } = response.data;
      newData.map((da, index) => Object.assign(da, { _uuid: da.id ? da.id : `${da[0]}${index}` }));
      setData(newData);
      setTotalRowCount(total);
    } else {
      console.log('error');
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { resetSelected(); }, [data.length]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getRegister(); }, [pagingParam]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getRegister(); }, [getDataFlag]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title=""
          drawerOpen={drawerOpen}
          drawerData={editRow}
          onDrawerClose={() => setDrawerOpen(false)}
          onDrawerUpdate={(model) => {
            setDrawerOpen(false);
            rowEdit(model).then((response) => {
              if (response.error === false) {
                getRegister();
              }
            });
          }}
          dialogOnSubmit={(model) => insertNewRow(model)
            .then((response) => {
              if (response.error === false) {
                getRegister();
              }
            })}
          confirmationDialogSubmit={(model) => removeRow(model)
            .then((response) => {
              if (response.error === false) {
                getRegister();
              }
            })}
          selectedData={selected}
          columns={columns}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              columns={columns}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .map((row, index) => {
                  const isItemSelected = isSelected(row._uuid);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._uuid)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={`tr${index}`}
                      selected={isItemSelected}
                    >
                      {columns.map((col, index2) => (
                        <>
                          {index2 === 0 && (
                            <TableCell padding="checkbox" key={`tc${index}${index2}${col.id}`}>
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                                key={`cb${index}${index2}${col.id}`}
                              />
                            </TableCell>
                          )}
                          {
                            <TableCell id={labelId} scope="row" padding="none" align="left" key={`tcl${index}${index2}`}>
                              {row[col.id] !== undefined
                                ? (col.date ? new Date(Date.parse(row[col.id])).toLocaleString() : row[col.id])
                                : (
                                  <Button
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    className={classes.margin}
                                    onClick={() => {
                                      setDrawerOpen(true);
                                      setEditRow(row);
                                    }}
                                    key={`b${index}${index2}`}
                                  >
                                    Edit
                                  </Button>
                                )}
                            </TableCell>
                          }
                        </>
                      ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRowCount || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default DataTable;

DataTable.propTypes = {
  columns: PropTypes.array,
  onPerPageChange: PropTypes.func,
  onPageCountChange: PropTypes.func,
  onPageChange: PropTypes.func,
  defaultRowsPerPage: PropTypes.number,
  rowEdit: PropTypes.func,
  insertNewRow: PropTypes.func,
  removeRow: PropTypes.func,
  getData: PropTypes.func,
  getDataFlag: PropTypes.bool,
};

DataTable.defaultProps = {
  columns: [],
  onPerPageChange: (e) => console.log(e),
  onPageCountChange: (e) => console.log(e),
  onPageChange: (e) => console.log(e),
  defaultRowsPerPage: 5,
  rowEdit: () => console.log('edit'),
  insertNewRow: () => { },
  removeRow: () => { },
  getData: () => { },
  getDataFlag: false,
};
