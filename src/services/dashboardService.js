import { Fetch } from '../components/Fetch';
import urlConfig from '../configs/urlConfig';
import utilitity from '../configs/utilitiy';

export default {
  getAllCards: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.dashboard.allCards, requestOptions);
  },
  getTotalWordsCard: (daterange) => {
    const requestOptions = {
      method: 'GET',
      headers: utilitity.authorizedHeader(),
    };

    return Fetch(`${urlConfig.dashboard.totalWordsCard}/${daterange}`, requestOptions);
  },
  getLearnedWordsCard: (daterange) => {
    const requestOptions = {
      method: 'GET',
      headers: utilitity.authorizedHeader(),
    };

    return Fetch(`${urlConfig.dashboard.learnedWordsCard}/${daterange}`, requestOptions);
  },
  getTotalSentencesCard: (daterange) => {
    const requestOptions = {
      method: 'GET',
      headers: utilitity.authorizedHeader(),
    };

    return Fetch(`${urlConfig.dashboard.totalSentencesCard}/${daterange}`, requestOptions);
  },
  getChartCard: (daterange) => {
    const requestOptions = {
      method: 'GET',
      headers: utilitity.authorizedHeader(),
    };

    return Fetch(`${urlConfig.dashboard.chartCard}/${daterange}`, requestOptions);
  }
};
