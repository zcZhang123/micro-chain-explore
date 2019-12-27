module.exports = {

  friendlyName: 'Get blocks detail by block num',

  description: '',

  inputs: {
    blockNum: {
      type: 'number'
    }
  },

  exits: {
  },

  fn: async function ({ blockNum }) {
    try {
      let detail = await Blocks.findOne({ number: blockNum })
      return Utils._return(ResultCode.OK_GET_BLOCKS_DETAIL, { detail: detail });
    } catch (error) {
      return this.res.serverError(error);
    }
  }

};
