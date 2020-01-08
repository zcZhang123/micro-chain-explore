const abiDecoder = require('abi-decoder')
abiDecoder.addABI(JSON.parse(sails.config.custom.deltaABI))
module.exports = {

  friendlyName: 'Analyze kline data',

  description: '',

  inputs: {

  },

  exits: {

  },

  fn: async function () {
    let blockNum = await sails.helpers.getBlockNumber();
    let blockNumToRedis = await RedisUtils.getBlockNumToRedis();
    if (blockNumToRedis < blockNum) {
      for (blockNumToRedis; blockNumToRedis <= blockNum; blockNumToRedis++) {
        let blockDetails = await sails.helpers.getBlocks(blockNumToRedis);
        if (blockDetails.transactions.length > 0) {
          sails.log.info("区块中交易信息数量是__" + blockDetails.transactions.length + "当前区块为__" + blockNumToRedis)
          let txs = blockDetails.transactions;
          let timestamp = blockDetails.timestamp;
          for (var i = 0, length = txs.length; i < length; i++) {
            let tx = await sails.helpers.getTransaction(txs[i])
            let trade = Utils.isTrade(tx.input)
            sails.log.info("区块中交易信息是否是成交挂单__" + trade)
            if (trade) {
              let input = '0x' + tx.input.substring(42)
              let tradeDetails = abiDecoder.decodeMethod(input)
              tradeDetails.timestamp = timestamp;
              console.log('blockNumber is', blockNumToRedis)
              let res = await sails.helpers.saveKlineData(tradeDetails);
              sails.log.info("blockNum 为 __" + blockNumToRedis + "__数据保存成功")
            }
          }
        }
        await RedisUtils.saveBlockNum(blockNumToRedis)
        sails.log.info("保存到Redis的区块号为__" + blockNumToRedis)
      }
    }

  }

};

