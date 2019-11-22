var Decimal = require('decimal.js');
module.exports = {

  friendlyName: 'Get micro chain info',

  description: '',

  inputs: {
  },

  exits: {
  },

  fn: async function () {
    try {
      let info = await sails.helpers.getSubChainInfo();
      if (info) {
        info.Balance = new Decimal(info.Balance) / (new Decimal(1000000000000000000))
        info.BondLimit = new Decimal(info.BondLimit) / (new Decimal(1000000000000000000))
        info.BlockReward = new Decimal(info.BlockReward) / (new Decimal(1000000000000000000))
        info.TxReward = new Decimal(info.TxReward) / (new Decimal(1000000000000000000))
        info.ViaReward = new Decimal(info.ViaReward) / (new Decimal(1000000000000000000))
      }
      return Utils._return(ResultCode.OK_GET_MICRO_CHAIN_INFO, info)
    } catch (error) {
      return error
    }

  }

};
