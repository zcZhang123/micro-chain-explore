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
    let detail = await Transactions.findOne({ transaction_hash: hash });
    return Utils._return(ResultCode.OK_GET_TRADE_DETAIL, detail);
  }

};
