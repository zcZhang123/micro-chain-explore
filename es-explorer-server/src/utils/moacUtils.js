const { config } = require("../config/config")
const Chain3 = require("chain3")
const chain3 = new Chain3();
var logger = require('./logger')
const axios = require("axios");
const fetch = axios.create({ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });
const url = config.microChain.scsUri

// 获取最新区块
exports.getBlockNumber = async function () {
    var data = {
        jsonrpc: '2.0',
        id: 0,
        method: 'scs_getBlockNumber',
        params:
            [config.microChain.microChain]
    }
    var res = await fetch.post(url, JSON.stringify(data))
    return chain3.toDecimal(res.data.result)
}

// 获取指定区块信息
exports.getBlock = async function (blockNum) {
    let num = chain3.toHex(blockNum)
    var data = {
        jsonrpc: '2.0',
        id: 0,
        method: 'scs_getBlock',
        params:
            [config.microChain.microChain, num]
    }
    var res = await fetch.post(url, JSON.stringify(data))
    return res.data.result;
}

// 获取指定交易收据
exports.getReceiptByHash = async function (txHash) {
    var data = {
        jsonrpc: '2.0',
        id: 0,
        method: 'scs_getReceiptByHash',
        params:
            [config.microChain.microChain, txHash]
    }
    let res = await fetch.post(url, JSON.stringify(data));
    return res.data.result;
}

// 获取指定交易信息
exports.getTransactionByHash = async function (txHash) {
    var data = {
        jsonrpc: '2.0',
        id: 0,
        method: 'scs_getTransactionByHash',
        params:
            [config.microChain.microChain, txHash]
    }
    let res = await fetch.post(url, JSON.stringify(data));
    logger.info("aaaaaaaaaaaaaaaaaaaaa")
    return res.data.result;
}