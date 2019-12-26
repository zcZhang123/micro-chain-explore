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
        info.Balance = Chain3.chain3.fromSha(Chain3.chain3.toDecimal(info.balance))
        info.BondLimit = Chain3.chain3.fromSha(Chain3.chain3.toDecimal(info.bondLimit))
        info.BlockReward = Chain3.chain3.fromSha(Chain3.chain3.toDecimal(info.blockReward))
        info.TxReward = Chain3.chain3.fromSha(Chain3.chain3.toDecimal(info.txReward))
        info.ViaReward = Chain3.chain3.fromSha(Chain3.chain3.toDecimal(info.viaReward))
      }
      return Utils._return(ResultCode.OK_GET_MICRO_CHAIN_INFO, info)
    } catch (error) {
      return error
    }

  }

};
