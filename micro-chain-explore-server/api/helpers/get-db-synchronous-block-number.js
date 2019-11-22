module.exports = {

  friendlyName: 'Get db synchronous block number',

  inputs: {
  },

  exits: {

    success: {
      outputFriendlyName: 'Db synchronous block number',
    },

  },

  fn: async function () {
    let block = await Blocks.find()
      .sort('block_number DESC')
      .skip(0).limit(1);
    if (block.length == 0) {
      return 0
    }
    return block[0].block_number;
  }

};

