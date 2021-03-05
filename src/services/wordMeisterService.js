import { Fetch } from '../components/Fetch';
import urlConfig from '../configs/urlConfig';
import utilitity from '../configs/utilitiy';

export default {
  addWord: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.wordMeister.addWord, requestOptions);
  },
  getWord: (wordId) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(wordId),
    };
    return Fetch(`${urlConfig.wordMeister.getWord}`, requestOptions);
  },
  getWords: (id) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(id),
    };
    return Fetch(`${urlConfig.wordMeister.getWords}`, requestOptions);
  },
  updateWord: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.wordMeister.updateWord, requestOptions);
  },
  deleteWord: (model) => {
    const requestOptions = {
      method: 'DELETE',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.wordMeister.deleteWord, requestOptions);
  },
  getKeywords: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.wordMeister.getKeywords, requestOptions);
  },
  getWordCard: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };

    return Fetch(urlConfig.wordMeister.wordCard, requestOptions);
  },
  setWordPoint: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.wordMeister.wordPoint, requestOptions);
  },
  setWordFavorite: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.wordMeister.wordFavorite, requestOptions);
  },
  setCustomSentence: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.wordMeister.customSentence, requestOptions);
  },
  setLearned: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.wordMeister.learned, requestOptions);
  },
  setUserWordSetting: (model) => {
    const requestOptions = {
      method: 'POST',
      headers: utilitity.authorizedHeader(),
      body: JSON.stringify(model),
    };
    return Fetch(urlConfig.wordMeister.userWordSetting, requestOptions);
  },
  getUserWordSetting: () => {
    const requestOptions = {
      method: 'GET',
      headers: utilitity.authorizedHeader(),
    };
    return Fetch(urlConfig.wordMeister.userWordSetting, requestOptions);
  }
};
