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
      console.log("blockNumToDB", blockNumToDB)
      console.log("blockNum", blockNum)
      if (blockNumToDB < blockNum) {
        blockNumToDB = blockNumToDB + 1
        for (blockNumToDB; blockNumToDB <= blockNum; blockNumToDB++) {
          let info = await sails.helpers.getBlocks(blockNumToDB);
          let block = {
            extra_data: info.extraData,
            hash: info.hash,
            miner: info.miner,
            number: info.number,
            parent_hash: info.parentHash,
            receipts_root: info.receiptsRoot,
            state_root: info.stateRoot,
            timestamp: info.timestamp,
            transactions: info.transactions,
            transactions_root: info.transactionsRoot
          }
          await Blocks.create(block);
          if (info.transactions.length > 0) {
            let txs = info.transactions;
            let timestamp = info.timestamp;
            for (var i = 0, length = txs.length; i < length; i++) {
              let tx = await sails.helpers.getTransaction(txs[i])
              // let input = sails.config.custom.dappBase + Chain3.chain3.sha3('redeemFromMicroChain()').substr(2, 10)
              // let type = 3;
              // if (input == tx.input) {
              //   type = 1
              // }
              let txInfo = {
                block_hash: tx.blockHash,
                block_number: tx.blockNumber,
                from: tx.from,
                to: tx.to,
                value: Chain3.chain3.fromSha(tx.value.toString()),
                input: tx.input,
                nonce: tx.nonce,
                r: tx.r,
                s: tx.s,
                v: tx.v,
                sharding_flag: tx.shardingFlag,
                transaction_hash: tx.transactionHash,
                transaction_index: tx.transactionIndex,
                time: timestamp
              }
              await Transactions.create(txInfo)
            }
          }
        }
        return '数据同步成功'
      } else {
        return '已是最新数据'
      }
    } catch (error) {
      return error;
    }
  }
};
