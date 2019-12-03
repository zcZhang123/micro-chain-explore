var Decimal = require('decimal.js');
module.exports = {

  friendlyName: 'Get wallet detail by address',

  description: '',

  inputs: {
    address: {
      type: 'string'
    },
    tradePartner: {
      type: 'string'
    },
    tradeStart: {
      type: 'string'
    },
    tradeEnd: {
      type: 'string'
    }
  },

  exits: {
  },

  fn: async function ({ address, tradePartner }) {
    try {
      let blance = await sails.helpers.getWalletBlance(address);
      blance = new Decimal(blance) / (new Decimal(1000000000000000000))
      let trade = []
      let fromTradeList = []
      let toTradeList = []
      if (tradePartner != '') {
        // 交易对家不为空时查询
        fromTradeList = await Transactions.find({ from: address })
          .where({ to: tradePartner })
        toTradeList = await Transactions.find({ to: address })
          .where({ from: tradePartner })
      } else {
        fromTradeList = await Transactions.find({ from: address })
        toTradeList = await Transactions.find({ to: address })
      }
      trade = fromTradeList.concat(toTradeList)
      return Utils._return(ResultCode.OK_GET_WALLET_DETAIL, { blance: blance, trade: trade })
    } catch (error) {
      return error
    }
  }

};
