var Decimal = require('decimal.js');
module.exports = {

  friendlyName: 'Get wallet detail by address',

  description: '',

  inputs: {
    address: {
      type: 'string'
    }
  },

  exits: {
  },

  fn: async function ({ address }) {
    try {
      let blance = await sails.helpers.getWalletBlance(address);
      blance = new Decimal(blance) / (new Decimal(1000000000000000000))
      let trade = []
      let fromTradeList = await Transactions.find({ from: address })
      let toTradeList = await Transactions.find({ to: address })
      trade = fromTradeList.concat(toTradeList)
      return { blance: blance, trade: trade }
    } catch (error) {
      return error
    }
  }

};
