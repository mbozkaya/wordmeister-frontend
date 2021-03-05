import constants from './Constants';

const common = {
  currentUser: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) return user;

    return {};
  },
  getDashboardFilter: () => {
    const filter = JSON.parse(localStorage.getItem('dashboardFilter'));
    if (filter) return filter;

    return {
      totalWords: constants.dateRange.today,
      learnedWords: constants.dateRange.today,
      totalSentences: constants.dateRange.today,
      chartData: constants.dateRange.today,
    };
  },
  setDateRangeFilter: (type, value) => {
    const filter = common.getDashboardFilter();
    filter[type] = value;
    localStorage.setItem('dashboardFilter', JSON.stringify(filter));
  },
};

export default common;
