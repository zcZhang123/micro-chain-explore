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
      sails.log.info("blockNumToDB", blockNumToDB)
      sails.log.info("blockNum", blockNum)
      await Blocks.destroy({ number: blockNumToDB })
      if (blockNumToDB < blockNum) {
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
              let isSync = await Transactions.count({ transaction_hash: txs[i] })
              if (isSync == 0) {
                let tx = await sails.helpers.getTransaction(txs[i])
                let dapps = await sails.helpers.getDapps();
                let txInfo = {
                  block_hash: tx.blockHash,
                  block_number: tx.blockNumber,
                  from: tx.from,
                  to: _.indexOf(dapps, tx.input.slice(0, 42)) ? tx.input.slice(0, 42) : tx.to,
                  value: Utils.chain3.fromSha(tx.value.toString()),
                  input: tx.input,
                  nonce: tx.nonce,
                  r: tx.r.toString(),
                  s: tx.s.toString(),
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
        }
      }
    } catch (error) {
      return error;
    }
  },
};
