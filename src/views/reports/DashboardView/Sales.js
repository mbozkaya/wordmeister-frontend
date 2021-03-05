import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors,
  Select,
  MenuItem,
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Sales = (props) => {
  const {
    className, datasets, labels, onDateRangeChage, dateRange, ...rest
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  datasets.forEach((f, i) => {
    f.backgroundColor = i === 0 ? colors.indigo[500] : colors.green[500];
    f.barThickness = 12;
    f.maxBarThickness = 10;
    f.barPercentage = 0.5;
    f.categoryPercentage = 0.5;
  });
  const [chartData, setChartData] = useState({
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: [18, 5, 19, 27, 29, 19, 20],
        label: 'This year'
      },
      {
        backgroundColor: colors.grey[200],
        data: [11, 20, 12, 29, 30, 25, 13],
        label: 'Last year'
      },
      {
        backgroundColor: colors.green[200],
        data: [11, 20, 12, 29, 30, 25, 13],
        label: 'Last year'
      }
    ],
    labels: ['1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug', '6 Aug', '7 Aug']
  });

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  useEffect(() => {
    setChartData({
      ...chartData,
      datasets,
      labels,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasets, labels]);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={(
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={dateRange}
            onChange={(e) => { onDateRangeChage(e.target.value); }}
          >
            <MenuItem value={2}>Last Week</MenuItem>
            <MenuItem value={3}>Last Month</MenuItem>
            <MenuItem value={4}>Last 6 months</MenuItem>
            <MenuItem value={5}>All Time</MenuItem>
          </Select>
        )}
        title="Latest Sales"
      />
      <Divider />
      <CardContent>
        <Box
          height={400}
          position="relative"
        >
          <Bar
            data={chartData}
            options={options}
          />
        </Box>
      </CardContent>
      <Divider />
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
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
};

Sales.propTypes = {
  className: PropTypes.string,
  datasets: PropTypes.array,
  labels: PropTypes.array,
  onDateRangeChage: PropTypes.func,
  dateRange: PropTypes.number.isRequired,
};

Sales.DefaultPropTypes = {
  datasets: [{
    backgroundColor: colors.grey[500],
    data: [],
    label: ''
  }],
  labels: [''],
  onDateRangeChage: () => { },
};

export default Sales;
