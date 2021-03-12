/* eslint-disable no-nested-ternary */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
  Select,
  MenuItem,
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import constant from '../../../helpers/Constants';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatarDown: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56
  },
  differenceIconDown: {
    color: colors.red[900]
  },
  differenceValueDown: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  },
  avatarUp: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56
  },
  differenceIconUp: {
    color: colors.green[900]
  },
  differenceValueUp: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const dateText = {
  1: 'yesterday',
  2: 'last week',
  3: 'last month',
  4: 'last six months',
  5: 'from beginning',
};

const Budget = (props) => {
  const classes = useStyles();
  const {
    className,
    wordCount,
    increasingRate,
    dateRange,
    icon,
    title,
    onDateRangeChange,
    cardType,
    ...rest
  } = props;
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              {title}
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {wordCount}
            </Typography>
          </Grid>
          <Grid item>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dateRange}
              onChange={(e) => { onDateRangeChange(e.target.value); }}
            >
              <MenuItem value={1}>Today</MenuItem>
              <MenuItem value={2}>Last Week</MenuItem>
              <MenuItem value={3}>Last Month</MenuItem>
              <MenuItem value={4}>Last 6 months</MenuItem>
              <MenuItem value={5}>All Time</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            {
              cardType === constant.dashboardCardType.totalWords
              && dateRange === constant.dateRange.allTime ? (
                <>-</>
                ) : (increasingRate < 1
                  ? (<ArrowDownwardIcon className={classes.differenceIconDown} />)
                  : (<ArrowUpwardIcon className={classes.differenceIconUp} />))

            }
            <Typography
              className={classes.differenceValue}
              variant="body2"
            >
              {`${(increasingRate * 100).toFixed(2)}%`}
            </Typography>
            <Typography
              color="textSecondary"
              variant="caption"
            >
              {`Since ${dateText[dateRange]}`}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={increasingRate < 1 ? classes.avatarDown : classes.avatarUp}>
              {icon}
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string,
  wordCount: PropTypes.number,
  increasingRate: PropTypes.number,
  dateRange: PropTypes.number,
  title: PropTypes.string,
  icon: PropTypes.element.isRequired,
  onDateRangeChange: PropTypes.func,
  cardType: PropTypes.number,
};

Budget.defaultPropTypes = {
  wordCount: 0,
  increasingRate: 0,
  dateRange: 1,
  title: '',
  onDateRangeChange: (value) => { console.log(value); },
  cardType: constant.dashboardCardType.totalWords,
};

export default Budget;
