module.exports = {

  friendlyName: 'Get kline',

  description: '',

  inputs: {
    base: {
      type: 'string'
    },
    counter: {
      type: 'string'
    },
    type: {
      type: 'string'
    }
  },

  exits: {

  },

  fn: async function ({ base, counter, type }) {
    try {
      let key = base + '-' + counter + '/' + type;
      let klineData = await sails.helpers.getRedisKline(key);
      return Utils._return(ResultCode.OK_GET_KLINE, klineData)
    } catch (error) {
      return this.res.serverError(error);
    }
  }
};
