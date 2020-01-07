module.exports = {

  friendlyName: 'Start synchronous data',

  inputs: {
  },

  exits: {
  },


  fn: async function () {
    while (true) {
      sails.log.info(new Date().toLocaleTimeString(), 'Sync')
      await sails.helpers.sync.syncMicroChain();
      await sails.helpers.sync.getOrders();
      await new Promise(resolve => setTimeout(resolve, 10000))
    }
  },
};
