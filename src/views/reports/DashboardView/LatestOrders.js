import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  Link
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestOrders = (props) => {
  const { rows, className, ...rest } = props;
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Latest Orders" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Word
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell sortDirection="desc">
                  {/* <Tooltip
                    enterDelay={300}
                    title="Sort"
                  >
                    <TableSortLabel
                      active
                      direction="desc"
                    >
                    </TableSortLabel>
                  </Tooltip> */}
                  Created Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (rows.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                >
                  <TableCell>
                    {row.word}
                  </TableCell>
                  <TableCell>
                    {row.description}
                  </TableCell>
                  <TableCell>
                    {moment(row.createdDate).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={row.status ? 'secondary' : 'secondary'}
                      label={row.status ? 'Sent' : 'Not send'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              )))
                : (
                  <TableRow
                    hover
                  >
                    <TableCell colSpan={4} align="center">
                      There is no rows.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          type="button"
        >
          <Link
            component={RouterLink}
            to="/app/word"
            variant="h6"
          >
            View All
          </Link>
        </Button>
      </Box>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string,
  rows: PropTypes.array
};

LatestOrders.DefaultPropTypes = {
  rows: [],
};

export default LatestOrders;
