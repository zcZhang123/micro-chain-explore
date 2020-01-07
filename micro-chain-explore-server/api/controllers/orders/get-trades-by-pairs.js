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
      let trades = await Orders.find(
        {
          where: { tokenGet: baseToken, tokenGive: exToken, order_type: Contant.TRADE_TYPE.trade },
          select: ['order_id', 'type', 'tokenGet', 'amountGet', 'tokenGive', 'amountGive', 'price', 'expires', 'time', 'amount']
        }).sort('createdAt DESC').limit(50)
      return Utils._return(ResultCode.OK_GET_ORDER, { trades })
    } catch (error) {
      return this.res.serverError(error);
    }
  }

};
