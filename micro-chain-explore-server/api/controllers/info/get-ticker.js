module.exports = {

  friendlyName: 'Get ticker',

  description: '',

  inputs: {
    base: {
      type: 'string'
    },
    counter: {
      type: 'string'
    }
  },

  exits: {
  },

  fn: async function ({ base, counter }) {
    try {
      let key = base + '-' + counter + '/day';
      let klineData = await sails.helpers.getRedisKline(key);
      let ticker = await sails.helpers.getTickerInfo(klineData);
      return Utils._return(ResultCode.OK_GET_TICKER, ticker)
    } catch (error) {
      return this.res.serverError(error);
    }
  }

};
