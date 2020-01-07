module.exports = {

  friendlyName: 'Get orders by address',

  description: '',

  inputs: {
    address: {
      type: 'string',
      required: true
    },
    page: { // isLatest为false时生效,当前页数
      type: 'number',
      required: true
    },
    seq: { // isLatest为false时生效,每页显示多少条
      type: 'number',
      required: true
    }
  },

  exits: {
  },

  fn: async function ({ address, page, seq }) {
    try {
      let count = await Orders.count({ user: address })
      let orders = await Orders.find(
        {
          where: { user: address },
          select: ['order_id', 'order_type', 'tokenGet', 'amountGet', 'tokenGive', 'amountGive', 'price', 'expires', 'time']
        }).sort('createdAt DESC').skip((page - 1) * seq).limit(seq)
      return Utils._return(ResultCode.OK_GET_ORDER, { orders: orders, count: count })
    } catch (error) {
      return this.res.serverError(error);
    }
  }

};
