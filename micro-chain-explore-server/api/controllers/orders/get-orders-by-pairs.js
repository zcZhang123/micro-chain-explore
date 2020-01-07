module.exports = {

  friendlyName: 'Get orders by pairs',

  description: 'limit 50',

  inputs: {
    exToken: {
      type: 'string',
      required: true
    },
    baseToken: {
      type: 'string',
      required: true
    },
  },

  exits: {
  },

  fn: async function ({ exToken, baseToken }) {
    try {
      let buys = await Orders.find(
        {
          where: { tokenGet: baseToken, tokenGive: exToken },
          select: ['order_id', 'type', 'tokenGet', 'amountGet', 'tokenGive', 'amountGive', 'price', 'expires', 'time']
        }).sort('price DESC', 'createdAt DESC').limit(50)
      let sells = await Orders.find(
        {
          where: { tokenGet: exToken, tokenGive: baseToken },
          select: ['order_id', 'type', 'tokenGet', 'amountGet', 'tokenGive', 'amountGive', 'price', 'expires', 'time']
        }).sort('price DESC', 'createdAt DESC').limit(50)
      return Utils._return(ResultCode.OK_GET_ORDER, { buys, sells })
    } catch (error) {
      return this.res.serverError(error);
    }
  }

};
