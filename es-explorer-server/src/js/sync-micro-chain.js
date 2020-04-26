const uuidv4 = require('uuid/v4');
var logger = require('./logger')
const Chain3 = require("chain3")
const chain3 = new Chain3();
const { config } = require("../config/config")
const { getBlockNumber, getBlock, getReceiptByHash, getTransactionByHash, isERC20, addWalletFromInput } = require('../utils/moacUtils')
const { getBlockNumToES, createElement, createBulkElement, getBlocksCurveByTxLength, updateBlocksCurveNum } = require('../utils/esUtils')


exports.syncMicroChain = async function () {
  try {
    // 获取最新区块
    let blockNum = await getBlockNumber();
    console.info("最新区块为：", blockNum)
    // 获取es保存区块
    let blockNumToDB = await getBlockNumToES()
    // let blockNumToDB = 1
    console.info("es保存区块为：", blockNumToDB)

    // await Blocks.destroy({ number: blockNumToDB })
    // if (blockNumToDB > blockNum) {
    //   await Blocks.destroy({ number: { '>': blockNum } })
    //   await Transactions.destroy({ number: blockNumToDB })
    //   return
    // }
    if (blockNumToDB < blockNum) {
      for (blockNumToDB; blockNumToDB <= blockNum; blockNumToDB++) {
        let info = await getBlock(blockNumToDB);
        let transactions = info.transactions;
        let txlength = transactions.length;
        let block = {
          extra_data: info.extraData,
          hash: info.hash,
          miner: info.miner,
          number: chain3.toDecimal(info.number),
          parent_hash: info.parentHash,
          receipts_root: info.receiptsRoot,
          state_root: info.stateRoot,
          timestamp: chain3.toDecimal(info.timestamp),
          transactions: transactions,
          transactions_length: txlength,
          transactions_root: info.transactionsRoot
        }
        if (txlength > 0) {
          let txInfos = [];
          let addrSet = new Set();
          let tokenSet = new Set();
          let txs = info.transactions;
          let timestamp = chain3.toDecimal(info.timestamp);
          for (var i = 0, length = txs.length; i < length; i++) {
            // 查询是否首次同步
            // let isSync = await Transactions.count({ transaction_hash: txs[i] })
            if (isSync == 0) {
              let receipt = await getReceiptByHash(txs[i]);
              let tx = await getTransactionByHash(txs[i]);
              let contractAddress;// 部署合约地址
              let status;// 交易是否成功
              let logs = [];// 交易日志
              if (receipt) {
                // ERC20判定
                contractAddress = receipt.contractAddress;
                if (contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
                  let res = await isERC20(contractAddress)
                  if (res) {
                    let erc20 = {
                      erc20: contractAddress,
                      name: res.name,
                      symbol: res.symbol,
                      decimals: res.decimals,
                      totalSupply: res.totalSupply,
                      deployer: tx.from
                    }
                    // 保存erc20到es
                    var erc20Id = uuidv4().replace(/-/g, "");
                    let erc20Res = createElement('erc20', 'doc', erc20Id, erc20)
                    console.info("保存erc20到es，结果为：" + erc20Res)
                  }
                }
                status = !receipt.failed;
                _logs = receipt.logs;
                for (let i = 0, length = _logs.length; i < length; i++) {
                  let topics = _logs[i].topics;
                  let token = _logs[i].address;
                  if (topics[0] === config.microChain.transfer_sha) {
                    addrSet.add('0x' + topics[1].slice(26));
                    addrSet.add('0x' + topics[2].slice(26));
                    tokenSet.add(token)
                  }
                  let log = {
                    address: token,
                    topics: topics,
                    data: Buffer.from(_logs[i].data, 'base64').toString('hex'),
                  }
                  logs.push(log)
                }
              }
              let txInfo = {
                block_hash: tx.blockHash,
                block_number: chain3.toDecimal(tx.blockNumber),
                from: tx.from,
                to: tx.shardingFlag === 1 || tx.shardingFlag === 2 ? tx.input.slice(0, 42) : tx.to,
                value: Utils.chain3.fromSha(tx.value.toString()),
                input: tx.input,
                nonce: tx.nonce,
                r: tx.r.toString(),
                s: tx.s.toString(),
                v: tx.v,
                sharding_flag: tx.shardingFlag,
                transaction_hash: tx.transactionHash,
                transaction_index: tx.transactionIndex,
                time: timestamp,
                contractAddress: contractAddress,
                status: status,
                logs: logs,
                logs_length: logs.length
              }
              txInfos.push(txInfo);
              // 统计新地址
              await addWalletFromInput(txInfo);
            }
          }
          for (let token of tokenSet) {
            for (let address of addrSet) {
              let decimals = await ERC20.findOne({ where: { erc20: token }, select: ['decimals'] });
              await getBalance(address, token, decimals.decimals);
            }
          }
          if (txInfos.length > 0) {
            // 批量保存交易数据
            // await Transactions.createEach(txInfos);
            await createBulkElement('transactions', 'doc', txInfos)
          }
          // 按交易数查询BlocksCurve
          let res = await getBlocksCurveByTxLength(txlength)
          // let counts = await BlocksCruve.find({ trades: txlength }).limit(1);
          if (res.length == 0) {
            // 不存在该交易数的数据，新建
            var blockCurveId = uuidv4().replace(/-/g, "");
            await createElement("blocksCurve", "doc", blockCurveId, { blocks: 1, trades: txlength })
            // await BlocksCruve.create({
            //   blocks: 1,
            //   trades: txlength
            // })
          } else {
            // 已存在该条记录，原有基础上加一
            await updateBlocksCurveNum(txlength)
            // await BlocksCruve.update({ trades: txlength }).set({ blocks: counts[0].blocks + 1 })
          }
        }
        // 保存区块信息
        // await Blocks.create(block);
        await createElement("blocks", "doc", block.number, block)
      }
    }
  } catch (error) {
    logger.info(error)
  }
}
