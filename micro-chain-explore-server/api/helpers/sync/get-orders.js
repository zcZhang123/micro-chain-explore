const abiDecoder = require('abi-decoder')
const BigNumber = require('bignumber.js')
const Chain3 = require('chain3')
abiDecoder.addABI(JSON.parse(sails.config.custom.deltaABI))
var chain3 = new Chain3()

module.exports = {

  friendlyName: 'Get orders',

  inputs: {
  },

  exits: {
  },


  fn: async function () {
    try {
      const ethdAddr = sails.config.custom.deltaABI
      let count = 0
      let ordertmp = await Orders.find({ select: ['update_index'] }).sort('createdAt DESC').limit(1)
      let updateIndex = ordertmp[0] && ordertmp[0].update_index ? ordertmp[0].update_index : 0
      trade = await Transactions.find({
        where: { or: [{ from: ethdAddr }, { to: ethdAddr }], createdAt: { '>': updateIndex } },
        select: ['from', 'transaction_hash', 'input', 'time', 'createdAt']
      }).sort('createdAt ASC')

      for (var i = 0, length = trade.length; i < length; i++) {
        if (trade[i].input.slice(42, 49) === '0b92766') {
          let decodedData = abiDecoder.decodeMethod('0x' + trade[i].input.slice(42))
          let params = decodedData['params'];
          let amountGet = new BigNumber(chain3.fromSha(params[1]['value'])).toString();
          let amountGive = new BigNumber(chain3.fromSha(params[3]['value'])).toString();
          let buy_price = new BigNumber(amountGet).dividedBy(new BigNumber(amountGive)).toString();
          let sell_price = new BigNumber(amountGive).dividedBy(new BigNumber(amountGet)).toString();
          let order = {
            order_id: trade[i].transaction_hash,
            user: trade[i].from,
            tokenGet: params[0]['value'],
            amountGet: amountGet,
            tokenGive: params[2]['value'],
            amountGive: amountGive,
            buy_price: buy_price,
            sell_price: sell_price,
            expires: params[4]['value'],
            nonce: params[5]['value'],
            time: trade[i].time,
            update_index: trade[i].createdAt
          }
          count++
          await Orders.create(order);
        }
      }
      return '数据同步成功: ' + count + '条'
    } catch (error) {
      return error;
    }
  },
};
