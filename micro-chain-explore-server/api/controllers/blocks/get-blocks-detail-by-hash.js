module.exports = {

  friendlyName: 'Get blocks detail by hash',

  description: '',

  inputs: {
    hash: {
      type: 'string'
    }
  },

  exits: {

  },

  fn: async function ({ hash }) {
    try {
      let detail = await Blocks.findOne({ hash: hash })
      let tradeList = await Transactions.find({ block_hash: hash })
      return Utils._return(ResultCode.OK_GET_BLOCKS_DETAIL, { detail: detail, tradeList: tradeList });
    } catch (error) {
      return this.res.serverError(error);
    }
  }

};
