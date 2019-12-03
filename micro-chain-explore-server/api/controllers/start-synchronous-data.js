var Decimal = require('decimal.js');
var Chain3 = require('chain3');
var chain3 = new Chain3();
var address = require('../config.json')
module.exports = {

  friendlyName: 'Start synchronous data',

  inputs: {
  },

  exits: {
  },


  fn: async function () {
    try {
      let blockNumToDB = await sails.helpers.getDbSynchronousBlockNumber();
      let blockNum = await sails.helpers.getBlockNumber();
      if (blockNumToDB < blockNum) {
        blockNumToDB = blockNumToDB + 1
        for (blockNumToDB; blockNumToDB <= blockNum; blockNumToDB++) {
          let info = await sails.helpers.getBlocks(blockNumToDB);
          let data = info.result
          let block = {
            parent_hash: data.Header.parentHash,
            hash: data.Hash,
            state_root: data.Header.stateRoot,
            transactions_root: data.Header.transactionsRoot,
            receipts_root: data.Header.receiptsRoot,
            block_number: data.Header.number,
            timestamp: data.Header.timestamp,
            extra_data: data.Header.extraData,
            reward: data.Header.Reward,
            miner: data.Header.miner,
            transactions_num: data.Txs.length,
            random_int1: data.Header.RandomInt1,
            random_int2: data.Header.RandomInt2
          }
          await Blocks.create(block);
          if (data.Txs.length > 0) {
            let txs = data.Txs;
            for (let tx of txs) {
              let isTx = await Transactions.findOne({ hash: tx.hash })
              if (!isTx) {
                let input = address.dapp + chain3.sha3('redeemFromMicroChain()').substr(2, 10)
                let type = 3;
                if (input == tx.input) {
                  type = 1
                }
                let value = new Decimal(tx.value);
                let num = new Decimal(1000000000000000000)
                let txInfo = {
                  nonce: tx.nonce,
                  syscnt: tx.syscnt,
                  gas_price: tx.gasPrice,
                  gas: tx.gas,
                  from: tx.from,
                  to: tx.to,
                  value: value / num,
                  input: tx.input,
                  sharding_flag: tx.shardingFlag,
                  via: tx.via,
                  hash: tx.hash,
                  upper_hash: data.Hash,
                  block_num: data.Header.number,
                  trade_type: type,
                  trade_time: data.Header.timestamp
                }
                await Transactions.create(txInfo)
              }
            }
          }
        }
        return '数据同步成功'
      } else {
        return '已是最新数据'
      }
    } catch (error) {
      return error
    }


  }


};
