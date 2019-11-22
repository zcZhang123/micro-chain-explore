module.exports = {

  friendlyName: 'Get transaction detail by hash',

  description: '',

  inputs: {
    hash: {
      type: 'string'
    }
  },

  exits: {
  },

  fn: async function ({ hash }) {
    let detail = await Transactions.findOne({ hash: hash });
    return detail;
  }

};
