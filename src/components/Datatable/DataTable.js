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
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '@material-ui/core';
import EnhancedTableHead from './EnhencedTableHead';
import EnhancedTableToolbar from './EnhencedTableToolbar';

// function createData(name, calories, fat, carbs, protein) {
//   return {
//     name, calories, fat, carbs, protein
//   };
// }

// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Honeycomb', 408, 3.2, 87, 6.5),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0),
//   createData('KitKat', 518, 26.0, 65, 7.0),
//   createData('Lollipop', 392, 0.2, 98, 0.0),
//   createData('Marshmallow', 318, 0, 81, 2.0),
//   createData('Nougat', 360, 19.0, 9, 37.0),
//   createData('Oreo', 437, 18.0, 63, 4.0),
// ];

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

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
    defaultOrder, defaultOrderBy, defaultRowsPerPage, columns,
    rowEdit, insertNewRow, removeRow, getData, getDataFlag
  } = props;
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [order, setOrder] = React.useState(defaultOrder);
  const [orderBy, setOrderBy] = React.useState(defaultOrderBy);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
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

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

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

  useEffect(() => { resetSelected(); }, [data.length]);

  useEffect(() => {
    getRegister();
  }, [pagingParam]);
  useEffect(() => { getRegister(); }, [getDataFlag]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title="Register"
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
                      key={`tableRow${index}`}
                      selected={isItemSelected}
                    >
                      {columns.map((col, index2) => (
                        <>
                          {index2 === 0 && (
                            <TableCell padding="checkbox" key={`tableCell${row._uuid}${index2}`}>
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                                key={`${row._uuid}${col.id}`}
                              />
                            </TableCell>
                          )}
                          {
                            <TableCell id={labelId} scope="row" padding="none" align="left" key={`tableCell2${row._uuid}${index2}`}>
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
                                    key={`button${row._uuid}${index2}`}
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
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
};

export default DataTable;

DataTable.propTypes = {
  columns: PropTypes.array,
  onPerPageChange: PropTypes.func,
  onPageCountChange: PropTypes.func,
  onPageChange: PropTypes.func,
  defaultOrder: PropTypes.string,
  defaultOrderBy: PropTypes.string,
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
  defaultOrder: 'asc',
  defaultOrderBy: 'name',
  defaultRowsPerPage: 5,
  rowEdit: () => console.log('edit'),
  insertNewRow: () => { },
  removeRow: () => { },
  getData: () => { },
  getDataFlag: false,
};
