module.exports = {

  friendlyName: 'Get blocks detail by block num',

  description: '',

  inputs: {
    blockNum: {
      type: 'number'
    }
  },

  exits: {
  },

  fn: async function ({ blockNum }) {
    try {
      let detail = await Blocks.findOne({ block_number: blockNum })
      let tradeList = await Transactions.find({ block_num: blockNum })
      return Utils._return(ResultCode.OK_GET_BLOCKS_DETAIL, { detail: detail, tradeList: tradeList });
    } catch (error) {
      return error
    }
  }

};
