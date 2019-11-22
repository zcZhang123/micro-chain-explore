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
      return info
    } catch (error) {
      return error
    }

  }

};
