module.exports = {

  friendlyName: 'Get all tickers',

  description: '',

  inputs: {
  },

  exits: {
  },

  fn: async function () {
    try {
      var pairs = require('../../../assets/config/pairs.json')
      let tickers = {};
      for (let i = 0, len = pairs.length; i < len; i++) {
        let key = pairs[i].base + '-' + pairs[i].counter + '/day';
        let klineData = await sails.helpers.getRedisKline(key);
        let tickerData = await sails.helpers.getTickerInfo(klineData);
        let name = pairs[i].counterName + '-' + pairs[i].baseName
        tickers[name] = tickerData;
      }
      return Utils._return(ResultCode.OK_GET_TICKER, tickers)
    } catch (error) {
      return this.res.serverError(error);
    }
  }

};
