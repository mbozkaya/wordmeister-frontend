import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}));

const TasksProgress = (props) => {
  const { className, progressValue, ...rest } = props;
  const classes = useStyles();

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
              LEARNING PROGRESS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {`${(progressValue * 100).toFixed(2)}%`}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={6}>
          <LinearProgress
            value={progressValue * 100}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

TasksProgress.propTypes = {
  className: PropTypes.string,
  progressValue: PropTypes.number,
};

TasksProgress.defaultPropTypes = {
  progressValue: 0,
};

export default TasksProgress;
