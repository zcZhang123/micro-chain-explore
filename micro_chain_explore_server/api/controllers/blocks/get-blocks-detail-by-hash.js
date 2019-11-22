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
      let tradeList = await Transactions.find({ upper_hash: hash })
      return { detail: detail, tradeList: tradeList };
    } catch (error) {
      return error
    }
  }

};
