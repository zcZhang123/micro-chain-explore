module.exports = {

  friendlyName: 'Get hash type',

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
      let type;
      let block = await Blocks.find({ hash: hash })
      if (block.length > 0) {
        type = 0
      } else {
        let trade = await Transactions.find({ hash: hash })
        if (trade.length > 0) {
          type = 1
        } else {
          type = 2
        }
      }
      return type
    } catch (error) {
      return error
    }
  }

};
