module.exports = {

  friendlyName: 'Get wallet detail by address',

  description: '',

  inputs: {
    address: {
      type: 'string'
    },
    tradePartner: {
      type: 'string'
    },
    tradeStart: {
      type: 'string'
    },
    tradeEnd: {
      type: 'string'
    },
    page: { // isLatest为false时生效,当前页数
      type: 'number'
    },
    seq: { // isLatest为false时生效,每页显示多少条
      type: 'number'
    }
  },

  exits: {
  },

  fn: async function ({ address, tradePartner, page, seq }) {
    try {
      let balance = await sails.helpers.getWalletBlance(address);
      let trade = []
      let count;
      if (!tradePartner) {
        count = await Transactions.count({ from: address, to: tradePartner })
        trade = await Transactions.find(
          {
            where: { from: address, to: tradePartner },
            select: ['block_number', 'from', 'to', 'transaction_hash', 'time']
          }).skip((page - 1) * seq).limit(seq)
      } else {
        count = await Transactions.count({ or: [{ from: address }, { to: address }] })
        trade = await Transactions.find({
          where: { or: [{ from: address }, { to: address }] },
          select: ['block_number', 'from', 'to', 'transaction_hash', 'time']
        }).skip((page - 1) * seq).limit(seq)
      }
      return Utils._return(ResultCode.OK_GET_WALLET_DETAIL, { balance: balance, trade: trade, count: count })
    } catch (error) {
      return this.res.serverError(error);
    }
  }

};
