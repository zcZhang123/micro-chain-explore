module.exports = {

  friendlyName: 'Get transaction detail by hash',

  description: '',

  inputs: {
    hash: {
      type: 'string'
    }
  },

  exits: {
  },

  fn: async function ({ hash }) {
    let detail = await Transactions.findOne({ hash: hash });
    return Utils._return(ResultCode.OK_GET_TRADE_DETAIL, detail);
  }

};
