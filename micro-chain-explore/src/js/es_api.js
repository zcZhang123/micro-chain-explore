import esClient from './esClient'
const Chain3 = require("chain3")
const chain3 = new Chain3();
const axios = require("axios");
const fetch = axios.create({ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });

// 获取应用链信息
export const getMicroChainInfo = async function () {
    let params = JSON.stringify({ "jsonrpc": "2.0", "method": "scs_getMicroChainInfo", "params": [process.env.MICRO_CHAIN], "id": Math.floor((Math.random() * 100) + 1) })
    let response = await fetch.post(process.env.SCS_URI, params);
    let info = response.data.result;
    if (info) {
        info.Balance = chain3.fromSha(chain3.toDecimal(info.balance))
        info.BondLimit = chain3.fromSha(chain3.toDecimal(info.bondLimit))
        info.BlockReward = chain3.fromSha(chain3.toDecimal(info.blockReward))
        info.TxReward = chain3.fromSha(chain3.toDecimal(info.txReward))
        info.ViaReward = chain3.fromSha(chain3.toDecimal(info.viaReward))
    }
    return {
        code: '0',
        msg: '获取子链信息成功',
        data: info
    }
}

/**
 * @description 获取区块信息
 * @param isLatest 获取区块数据，true:首页数据，返回6条；false:获取指定区块数据
 * @param page     当前页数，从0开始
 * @param seq   每页显示条数
 * @param blockStart 指定开始区块号
 * @param blockEnd 指定结束区块号
 */
export const getBlocksList = async function (isLatest, page, seq, blockStart, blockEnd) {
    let res;
    if (isLatest) {
        res = await esClient.search({
            index: "blocks",
            body: {
                query: {
                    match_all: {}
                },
                sort: [
                    { number: 'desc' }
                ]
            },
            size: 6
        })
    } else {
        var number = {
            gte: blockStart,
            lte: blockEnd
        }
        if (blockStart) {
            number["gte"] = blockStart
        }
        if (blockEnd) {
            number["lte"] = blockEnd
        }
        res = await esClient.search({
            index: "blocks",
            body: {
                range: {
                    number: number
                }
            },
            from: (page - 1) * seq,
            size: seq,
            sort: [
                { number: "desc" }
            ]
        })
    }
    return { data: res.hits.hits }
}
