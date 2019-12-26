module.exports = {

  friendlyName: 'Get block number',

  description: '',

  inputs: {
  },

  exits: {
  },

  fn: async function () {
    return new Promise(function (resolve, reject) {
      try {
        let blockNum = Chain3.chain3.scs.getBlockNumber(sails.config.custom.microChain)
        resolve(blockNum)
      } catch (e) {
        reject(e)
      }
    })
  }
};

