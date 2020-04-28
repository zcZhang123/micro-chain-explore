import esClient from './esClient'
const Chain3 = require("chain3")
const chain3 = new Chain3();
const axios = require("axios");
const fetch = axios.create({ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });
const { disposeESData } = require('./utils')

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
    return info
}

/**
 * @description 获取区块信息
 * @param isLatest 是否是首页数据，true:首页数据，返回6条；false:获取指定区块数据
 * @param page     当前页数，从0开始
 * @param seq   每页显示条数
 * @param blockStart 指定开始时间
 * @param blockEnd 指定结束时间
 */
export const getBlocksList = async function (isLatest, page, seq, blockStart, blockEnd) {
    try {
        let res1;
        let count;
        if (isLatest) {
            res1 = await esClient.search({
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
            count = 6;
        } else {
            var body1;
            var timestamp = {
            }
            if (blockStart) {
                timestamp["gte"] = blockStart
            }
            if (blockEnd) {
                timestamp["lte"] = blockEnd
            }
            if (!blockStart && !blockEnd) {
                body1 = {
                    query: {
                        match_all: {}
                    }
                }
            } else {
                body1 = {
                    query: {
                        range: {
                            timestamp: timestamp
                        }
                    }
                }
            }
            var body2 = {
                from: (page - 1) * seq,
                size: seq,
                sort: [
                    { number: "desc" }
                ]
            }
            res1 = await esClient.search({
                index: "blocks",
                body: Object.assign(body2, body1)
            })
            var res2 = await esClient.count({
                index: "blocks",
                body: body1
            })
            count = res2.count
        }
        let blocksList = disposeESData(res1.hits.hits)
        return { data: blocksList, count: count }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * @description 获取交易信息
 * @param isLatest  是否是首页数据，true:首页数据，返回6条；false:获取指定交易数据
 * @param page     当前页数，从0开始
 * @param seq   每页显示条数
 * @param blockStart 指定开始时间
 * @param blockEnd 指定结束时间
 */
export const getTransactionsList = async function (isLatest, page, seq, tradeStart, tradeEnd) {
    try {
        var res1;
        var count = 0;
        if (isLatest) {
            res1 = await esClient.search({
                index: "transactions",
                body: {
                    query: {
                        match_all: {}
                    },
                    sort: [
                        { time: 'desc' }
                    ]
                },
                size: 6
            })
            count = 6
        } else {
            var body1;
            var time = {
            }
            if (tradeStart) {
                time["gte"] = tradeStart
            }
            if (tradeEnd) {
                time["lte"] = tradeEnd
            }
            if (!tradeStart && !tradeStart) {
                body1 = {
                    query: {
                        match_all: {}
                    }
                }
            } else {
                body1 = {
                    query: {
                        range: {
                            time: time
                        }
                    }
                }
            }
            var body2 = {
                from: (page - 1) * seq,
                size: seq,
                sort: [
                    { block_number: "desc" }
                ]
            }

            res1 = await esClient.search({
                index: "transactions",
                body: Object.assign(body2, body1)
            })
            let res2 = await esClient.count({
                index: "transactions",
                body: body1
            })
            count = res2.count
        }
        let tradeList = disposeESData(res1.hits.hits)
        return { data: tradeList, count: count }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 根据区块hash获取区块信息（包括交易信息）
 * @param hash 区块hash
 * @param page 当前页数，从0开始
 * @param seq 每页显示条数
 */
export const getBlockDetailByHash = async function (hash, page, seq) {
    try {
        let res1 = await esClient.search({
            index: 'blocks',
            body: {
                query: {
                    match: {
                        hash: hash
                    }
                }
            }
        })
        let detail = res1.hits.hits[0]._source
        console.log(detail)
        let tradeList = [];
        let count = detail.transactions_length;
        if (detail && detail.transactions_length > 0) {
            let res2 = await esClient.search({
                index: 'transactions',
                body: {
                    query: {
                        match: {
                            block_hash: hash
                        }
                    }
                },
                from: (page - 1) * seq,
                size: seq
            })
            tradeList = disposeESData(res2.hits.hits)
        }
        return { detail: detail, tradeList: tradeList, count: count }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 根据区块号获取区块信息（包括交易信息）
 * @param num 区块号
 * @param page 当前页数，从0开始
 * @param seq 每页显示条数
 */
export const getBlockDetailByBlockNum = async function (num, page, seq) {
    try {
        let res1 = await esClient.search({
            index: 'blocks',
            body: {
                query: {
                    match: {
                        number: num
                    }
                }
            }
        })
        let detail = res1.hits.hits[0]._source
        console.log(detail)
        let tradeList = [];
        let count = detail.transactions_length;
        if (detail && detail.transactions_length > 0) {
            let res2 = await esClient.search({
                index: 'transactions',
                body: {
                    query: {
                        match: {
                            block_number: num
                        }
                    }
                },
                from: (page - 1) * seq,
                size: seq
            })
            tradeList = disposeESData(res2.hits.hits)
        }
        return { detail: detail, tradeList: tradeList, count: count }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 根据交易hash获取交易详情
 * @param hash hash
 */
export const getTradeDetailByHash = async function (hash) {
    try {
        let res1 = await esClient.search({
            index: 'transactions',
            body: {
                query: {
                    match: {
                        transaction_hash: hash
                    }
                }
            }
        })
        let detail = res1.hits.hits[0]._source
        return detail
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 判断hash类型
 * @param hash hash
 * @returns 0: 区块hash，1: 交易hash，2: 未知hash
 */
export const getHashType = async function (hash) {
    try {
        let type = 0;
        let res1 = await esClient.search({
            index: 'blocks',
            body: {
                query: {
                    match: {
                        hash: hash
                    }
                }
            }
        })
        let res2 = await esClient.search({
            index: 'transactions',
            body: {
                query: {
                    match: {
                        transaction_hash: hash
                    }
                }
            }
        })
        if (res1.hits.hits.length > 0) {
            type = 0
        } else if (res2.hits.hits.length > 0) {
            type = 1
        } else {
            type = 2
        }
        return type
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 获取钱包地址的交易数据
 * @param address 钱包地址
 * @param tradePartner 交易对家
 * @param tradeStart 开始时间
 * @param tradeEnd 结束时间
 * @param page 当前页数，从0开始
 * @param seq 每页显示条数
 */
export const getTradeListByAddress = async function (address, tradePartner, tradeStart, tradeEnd, page, seq) {
    try {
        var bool = {
            should: [{
                multi_match: {
                    query: address,
                    fields: ["from", "to"]
                }
            }]
        }
        if (tradePartner) {
            bool =
            {
                should: [
                    {
                        bool: {
                            must: [
                                {
                                    match: {
                                        from: address
                                    }
                                },
                                {
                                    match: {
                                        to: tradePartner
                                    }
                                }
                            ]
                        }
                    },
                    {
                        bool: {
                            must: [
                                {
                                    match: {
                                        from: tradePartner
                                    }
                                },
                                {
                                    match: {
                                        to: address
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
        var time = {
        }
        if (tradeStart) {
            time["gte"] = tradeStart
        }
        if (tradeEnd) {
            time["lte"] = tradeEnd
        }
        var body1 = {}
        var body2 = {
            from: (page - 1) * seq,
            size: seq,
            sort: [
                { time: 'desc' }
            ]
        }
        if (!tradeStart && !tradeEnd) {
            body1 = {
                query: {
                    bool: bool
                }
            }
        } else {
            var filter = {
                range: {
                    time: time
                }
            }
            body1 = {
                query: {
                    bool: {
                        must: [
                            { bool: bool }
                        ],
                        filter: filter
                    }
                }
            }
        }
        let res1 = await esClient.search({
            index: "transactions",
            body: Object.assign(body2, body1)
        })
        let trade = disposeESData(res1.hits.hits)
        let res2 = await esClient.count({
            index: "transactions",
            body: body1
        })
        let count = res2.count
        return { trade: trade, count: count }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 获取钱包地址资产
 * @param address 钱包地址
 * @param page 当前页数，从0开始
 * @param seq 每页显示条数
 */
export const getAssetListByAddress = async function (address, page, seq) {
    try {
        let res1 = await esClient.search({
            index: "wallet",
            body: {
                query: {
                    bool: {
                        filter: [
                            {
                                match: {
                                    address: address
                                }
                            },
                            {
                                range: {
                                    balance: {
                                        gt: 0
                                    }
                                }
                            }
                        ]
                    }
                },
                from: (page - 1) * seq,
                size: seq
            }
        })
        let assetList = disposeESData(res1.hits.hits)
        let res2 = await esClient.count({
            index: "wallet",
            body: {
                query: {
                    bool: {
                        filter: [
                            {
                                match: {
                                    address: address
                                }
                            },
                            {
                                range: {
                                    balance: {
                                        gt: 0
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        })
        let count = res2.count
        if (assetList.length > 0) {
            for (let i = 0, len = assetList.length; i < len; i++) {
                let res3 = await esClient.search({
                    index: "erc20",
                    body: {
                        query: {
                            match: {
                                erc20: assetList[i].token
                            }
                        }
                    }
                })
                let token = res3.hits.hits[0]._source
                assetList[i].ERC20 = token
            }
        }
        return { data: assetList, count: count }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

// 获取交易数量曲线数据 未完成
export const getTransactionsCount = async function () {
    try {
        let transactionsList = []
        return { data: { data: transactionsList } }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

// 获取交易区块数统计信息
export const getBlocksTradesCount = async function () {
    try {
        let res = await esClient.search({
            index: "blocks_cruve",
            body: {
                query: {
                    match_all: {}
                }
            }
        })
        let blockList = res.hits.hits;
        return { data: { data: blockList } }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

// 判断是否是erc20
export const getIsErc20 = async function (address) {
    try {
        let isERC20;
        let res = await esClient.count({
            index: "erc20",
            body: {
                query: {
                    match: {
                        erc20: address
                    }
                }
            }
        })
        if (res.count > 0) {
            isERC20 = true
        } else {
            isERC20 = false
        }
        return { data: isERC20 }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 获取erc20列表
 * @param page 当前页数，从0开始
 * @param seq 每页显示条数
 * @param condition token地址/ token代称 / token名称
 */
export const getERC20List = async function (page, seq, condition) {
    try {
        let bool = {};
        if (condition) {
            bool = {
                should: [{
                    match: {
                        name: condition
                    }
                }, {
                    match: {
                        erc20: condition
                    }
                },
                {
                    match: {
                        symbol: condition
                    }
                }]
            }
        }
        let res1 = await esClient.search({
            index: "erc20",
            body: {
                bool: bool
            },
            from: (page - 1) * seq,
            size: seq
        })
        let erc20List = res1.hits.hits
        let res2 = await esClient.count({
            index: "erc20",
            body: {
                bool: bool
            }
        })
        let count = res2.count
        return { data: { data: erc20List, count: count } }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 获取erc20详细信息
 * @param ERC20Address erc20 地址
 */
export const getERC20Detail = async function (ERC20Address) {
    try {
        let res = await esClient.search({
            index: "erc20",
            body: {
                query: {
                    match: {
                        erc20: ERC20Address
                    }
                }
            }
        })
        let erc20Data = res.hits.hits
        return { data: { data: erc20Data } }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 获取erc20交易列表
 * @param page 当前页数，从0开始
 * @param seq 每页显示条数
 * @param ERC20Address erc20 地址
 */
export const getERC20TradeList = async function (page, seq, ERC20Address) {
    try {
        let res1 = await esClient.search({
            index: "transactions",
            body: {
                query: {
                    match: {
                        to: ERC20Address
                    }
                }
            },
            from: (page - 1) * seq,
            size: seq,
            sort: [
                { "block_number": "desc" }
            ]
        })
        let tradeList = res1.hits.hits
        let res2 = await esClient.count({
            index: "transactions",
            body: {
                query: {
                    match: {
                        to: ERC20Address
                    }
                }
            }
        })
        let tradeCount = res2.count
        return { data: { data: tradeList, count: tradeCount } }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 获取erc20持有人列表
 * @param page 当前页数，从0开始
 * @param seq 每页显示条数
 * @param ERC20Address erc20 地址
 */
export const getERC20HolderList = async function (page, seq, ERC20Address) {
    try {
        let res1 = await esClient.search({
            index: "wallet",
            body: {
                query: {
                    match: {
                        token: ERC20Address
                    }
                },
                range: {
                    balance: {
                        gt: 0
                    }
                }
            },
            from: (page - 1) * seq,
            size: seq,
            sort: [
                { "balance": "desc" }
            ]
        })
        let res2 = await esClient.count({
            index: "wallet",
            body: {
                query: {
                    match: {
                        token: ERC20Address
                    }
                },
                range: {
                    balance: {
                        gt: 0
                    }
                }
            }
        })
        let holderList = res1.hits.hits
        let count = res2.count
        return { data: { data: holderList, count: count } }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}

/**
 * 获取erc20详细信息
 * @param address erc20 地址
 */
export const getERC20Info = async function (address) {
    try {
        let res = await esClient.search({
            index: "erc20",
            body: {
                query: {
                    match: {
                        erc20: address
                    }
                }
            }
        })
        let erc20Data = res.hits.hits
        return { data: { info: erc20Data } }
    } catch (error) {
        console.log(error)
        return { msg: error }
    }
}
