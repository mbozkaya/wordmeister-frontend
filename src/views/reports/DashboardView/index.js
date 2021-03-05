import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Page from 'src/components/Page';
import dashboardService from 'src/services/dashboardService';
import ToasterSnackbar from 'src/components/ToasterSnackbar';
import common from 'src/helpers/common';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import constant from '../../../helpers/Constants';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const filter = common.getDashboardFilter();
  const [dashboardData, setDashboardData] = useState({
    chartData: {
      datasets: [],
      label: '',
      dateRange: filter.chartData,
      labels: [],
    },
    learnedWords: {
      dateRange: filter.learnedWords,
      rate: 0,
      wordCount: 0,
    },
    totalSentences: {
      dateRange: filter.totalSentences,
      rate: 0,
      wordCount: 0,
    },
    totalWords: {
      dateRange: filter.totalWords,
      rate: 0,
      wordCount: 0,
    },
    progressRate: 0,
    latestWords: [],
  });

  const getTotalWordsCard = (daterange) => {
    dashboardService.getTotalWordsCard(daterange).then((response) => {
      if (response && response.error === false) {
        const { data } = response;
        setDashboardData({
          ...dashboardData,
          totalWords: {
            ...data,
          },
        });
        common.setDateRangeFilter('totalWords', data.dateRange);
      } else {
        ToasterSnackbar.error({ message: response.errorMessage || '' });
      }
    });
  };

  const getLearnedWordsCard = (daterange) => {
    dashboardService.getLearnedWordsCard(daterange).then((response) => {
      if (response && response.error === false) {
        const { data } = response;
        setDashboardData({
          ...dashboardData,
          learnedWords: {
            ...data,
          },
        });
        common.setDateRangeFilter('learnedWords', data.dateRange);
      } else {
        ToasterSnackbar.error({ message: response.errorMessage || '' });
      }
    });
  };

  const getChartCard = (daterange) => {
    dashboardService.getChartCard(daterange).then((response) => {
      if (response && response.error === false) {
        const { data } = response;
        setDashboardData({
          ...dashboardData,
          chartData: {
            ...data,
          },
        });
        common.setDateRangeFilter('chartData', data.dateRange);
      } else {
        ToasterSnackbar.error({ message: response.errorMessage || '' });
      }
    });
  };

  const getTotalSentences = (daterange) => {
    dashboardService.getTotalSentencesCard(daterange).then((response) => {
      if (response && response.error === false) {
        const { data } = response;
        setDashboardData({
          ...dashboardData,
          totalSentences: {
            ...data,
          }
        });
        common.setDateRangeFilter('totalSentences', data.dateRange);
      } else {
        ToasterSnackbar.error({ message: response.errorMessage || '' });
      }
    });
  };

  const getDashboard = () => {
    const model = {
      totalWords: dashboardData.totalWords.dateRange,
      learnedWords: dashboardData.learnedWords.dateRange,
      totalSentences: dashboardData.totalSentences.dateRange,
      chartData: dashboardData.chartData.dateRange,
    };
    dashboardService.getAllCards(model).then((response) => {
      if (response && response.error === false) {
        const {
          data
        } = response;

        setDashboardData({
          ...dashboardData,
          ...data,
        });
      } else {
        ToasterSnackbar.error({ message: response.errorMessage || '' });
      }
    });
  };

  useEffect(() => { getDashboard(); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const {
    totalSentences, totalWords, chartData, learnedWords, progressRate
  } = dashboardData;
  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget
              icon={<SortByAlphaIcon />}
              title="Latest Added Words"
              dateRange={totalWords.dateRange}
              onDateRangeChange={(value) => { getTotalWordsCard(value); }}
              increasingRate={totalWords.rate}
              wordCount={totalWords.wordCount}
              cardType={constant.dashboardCardType.totalWords}
            />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget
              icon={<PeopleIcon />}
              title="Latest Learned Words"
              dateRange={learnedWords.dateRange}
              onDateRangeChange={(value) => { getLearnedWordsCard(value); }}
              increasingRate={learnedWords.rate}
              wordCount={learnedWords.wordCount}
              cardType={constant.dashboardCardType.learnedWords}
            />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress progressValue={progressRate} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget
              icon={<AttachMoneyIcon />}
              title="Latest Sent Sentences"
              dateRange={totalSentences.dateRange}
              onDateRangeChange={(value) => { getTotalSentences(value); }}
              increasingRate={totalSentences.rate}
              wordCount={totalSentences.wordCount}
              cardType={constant.dashboardCardType.totalSentences}
            />
            {/* <TotalProfit /> */}
          </Grid>
          <Grid
            item
            lg={6}
            md={12}
            xl={6}
            xs={12}
          >
            <Sales
              labels={chartData.labels}
              datasets={chartData.datasets}
              dateRange={chartData.dateRange}
              onDateRangeChage={(value) => getChartCard(value)}
            />
          </Grid>
          <Grid
            item
            lg={6}
            md={12}
            xl={6}
            xs={12}
          >
            <LatestOrders rows={dashboardData.latestWords} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
