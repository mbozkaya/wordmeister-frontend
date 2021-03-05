const appConfig = {
  debug: /param/.test((param) => { }),
  api: {
    release: '',
    development: 'https://localhost:5001/',
    accountService: () => (appConfig.debug ? `${appConfig.api.development}api/account` : `${appConfig.api.release}api/account`),
    service: () => (appConfig.debug ? `${appConfig.api.development}` : `${appConfig.api.release}`),
  },
};

export default appConfig;
