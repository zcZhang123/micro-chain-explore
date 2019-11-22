module.exports = {

  friendlyName: 'Get transactions list',

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
    let transactionsList;
    let count;
    if (isLatest) {
      transactionsList = await Transactions.find()
        .sort('createdAt DESC')
        .skip(0).limit(6);
      count = 6;
    } else {
      transactionsList = await Transactions.find()
        .sort('createdAt DESC')
        .skip(page * seq).limit(seq)
      count = await Transactions.count();
    }
    return Utils._return(ResultCode.OK_GET_TRADE_LIST, { data: transactionsList, count: count });

  }

};
