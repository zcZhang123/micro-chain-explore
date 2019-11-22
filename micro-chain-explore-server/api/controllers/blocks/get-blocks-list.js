module.exports = {

  friendlyName: 'Get blocks list',

  description: '',

  inputs: {
    isLatest: {// 查询首页区块数据，true:返回最新6条数据
      type: 'boolean'
    },
    page: { // isLatest为false时生效,当前页数,从0开始
      type: 'number'
    },
    seq: { // isLatest为false时生效,每页显示多少条
      type: 'number'
    }
  },

  exits: {
  },

  fn: async function ({ isLatest, page, seq }) {
    try {
      let blocksList;
      let count;
      if (isLatest) {
        blocksList = await Blocks.find()
          .sort('block_number DESC')
          .skip(0).limit(6);
        count = 6;
      } else {
        blocksList = await Blocks.find()
          .sort('block_number DESC')
          .skip(page * seq).limit(seq)
        count = await Blocks.count()
      }
      return { data: blocksList, count: count };
    } catch (error) {
      return error
    }
  }

};
