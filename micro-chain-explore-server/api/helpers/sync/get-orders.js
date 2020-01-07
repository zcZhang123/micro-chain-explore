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
      const ethdAddr = sails.config.custom.ethdAddr
      let ordertmp = await Orders.find({ select: ['update_index'] }).sort('createdAt DESC').limit(1)
      let updateIndex = ordertmp[0] && ordertmp[0].update_index ? ordertmp[0].update_index : 0
      let trade = await Transactions.find({
        where: { or: [{ from: ethdAddr }, { to: ethdAddr }], createdAt: { '>': updateIndex } },
        select: ['from', 'transaction_hash', 'input', 'time', 'createdAt']
      }).sort('createdAt ASC')

      for (var i = 0, length = trade.length; i < length; i++) {
        let functionHash = trade[i].input.slice(42, 50)
        //创建订单
        if (functionHash === sails.config.custom.order) {
          let decodedData = abiDecoder.decodeMethod('0x' + trade[i].input.slice(42))
          let params = decodedData['params']
          let tokenGet = params[0]['value'];
          let tokenGive = params[2]['value'];
          let amountGet = new BigNumber(chain3.fromSha(params[1]['value'])).toString();
          let amountGive = new BigNumber(chain3.fromSha(params[3]['value'])).toString();
          let param = {
            get: {
              token: tokenGet,
              amount: amountGet
            },
            give: {
              token: tokenGive,
              amount: amountGive
            },
          }
          let tp = Utils.getTpyeAndPrice(param);
          let price = tp.price;
          let type = tp.type;

          let order = {
            order_id: trade[i].transaction_hash,
            order_type: Contant.TRADE_TYPE.create,
            type: type,
            user: trade[i].from,
            tokenGet: params[0]['value'],
            amountGet: amountGet,
            tokenGive: params[2]['value'],
            amountGive: amountGive,
            price: price,
            expires: params[4]['value'],
            nonce: params[5]['value'],
            time: trade[i].time,
            update_index: trade[i].createdAt
          }
          await Orders.create(order);
        }
        // 订单成交
        else if (functionHash === sails.config.custom.trade) {
          let decodedData = abiDecoder.decodeMethod('0x' + trade[i].input.slice(42))
          let params = decodedData['params']
          let tokenGet = params[0]['value'];
          let tokenGive = params[2]['value'];
          let amountGet = new BigNumber(chain3.fromSha(params[1]['value'])).toString();
          let amountGive = new BigNumber(chain3.fromSha(params[3]['value'])).toString();
          let param = {
            get: {
              token: tokenGet,
              amount: amountGet
            },
            give: {
              token: tokenGive,
              amount: amountGive
            },
          }
          let tp = Utils.getTpyeAndPrice(param);
          let price = tp.price;
          let type = tp.type;

          let order = {
            order_id: trade[i].transaction_hash,
            order_type: Contant.TRADE_TYPE.trade,
            type: type,
            user: trade[i].from,
            tokenGet: params[0]['value'],
            amountGet: amountGet,
            tokenGive: params[2]['value'],
            amountGive: amountGive,
            price: price,
            expires: params[4]['value'],
            nonce: params[5]['value'],
            amount: new BigNumber(chain3.fromSha(params[10]['value'])).toString(),
            time: trade[i].time,
            update_index: trade[i].createdAt
          }
          await Orders.create(order);
        }
        // 取消订单
        else if (functionHash === sails.config.custom.cancelOrder) {
          let decodedData = abiDecoder.decodeMethod('0x' + trade[i].input.slice(42))
          let params = decodedData['params']
          let tokenGet = params[0]['value'];
          let tokenGive = params[2]['value'];
          let amountGet = new BigNumber(chain3.fromSha(params[1]['value'])).toString();
          let amountGive = new BigNumber(chain3.fromSha(params[3]['value'])).toString();
          let param = {
            get: {
              token: tokenGet,
              amount: amountGet
            },
            give: {
              token: tokenGive,
              amount: amountGive
            },
          }
          let tp = Utils.getTpyeAndPrice(param);
          let price = tp.price;
          let type = tp.type;

          let order = {
            order_id: trade[i].transaction_hash,
            order_type: Contant.TRADE_TYPE.cancel,
            type: type,
            user: trade[i].from,
            tokenGet: params[0]['value'],
            amountGet: amountGet,
            tokenGive: params[2]['value'],
            amountGive: amountGive,
            price: price,
            expires: params[4]['value'],
            nonce: params[5]['value'],
            time: trade[i].time,
            update_index: trade[i].createdAt
          }
          await Orders.create(order);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  ordersCreate: async function () {
    console.log('test')
  }
};
