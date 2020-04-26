const uuidv4 = require('uuid/v4');
var logger = require('./logger')
const { esClient } = require("./elisticClient")

/**
 * 获取保存最新区块号
 */
exports.getBlockNumToES = async function () {
    try {
        let res = await esClient.search({
            index: "blocks",
            body: {
                query: {
                    match_all: {}
                },
                sort: [
                    { number: 'desc' }
                ]
            },
            size: 1
        })
        let blockInfo = res.hits.hits
        return blockInfo[0]._source.number
    } catch (error) {
        logger.info("获取保存最新区块号 Error,", error)
        return { result: false, msg: error }
    }
}

/**
 * @description 保存数据到es
 * @param index 索引
 * @param type 类型
 * @param id id
 * @param data 保存数据
 */
exports.createElement = async function (index, type, id, data) {
    try {
        let res = await esClient.create({
            index: index,
            type: type,
            id: id,
            body: data
        })
        if (res._id == id) {
            return { result: true, msg: "保存数据成功" }
        } else {
            return { result: false, msg: "保存数据失败" }
        }
    } catch (error) {
        logger.info("保存数据到es Error,", error)
        return { result: false, msg: error }
    }
}

/**
 * @description 批量插入数据到ES
 * @param index 索引
 * @param type 类型
 * @param datas Array 数据
 */
exports.createBulkElement = async function (index, type, datas) {
    try {
        var bulkBody = []
        for (let i = 0, len = datas.length; i < len; i++) {
            let id = uuidv4().replace(/-/g, "");
            bulkBody.push({
                create: {
                    _index: index,
                    _type: type,
                    _id: id
                }
            })
            bulkBody.push(datas[i])
        }
        let res = await esClient.bulk({ body: bulkBody })
        logger.info("批量保存数据到es,", res)
        return res
    } catch (error) {
        logger.info("批量保存数据到es Error,", error)
        return { result: false, msg: error }
    }
}

/**
 * @description 根据条件查询Count
 * @param address 钱包地址
 * @param token 
 */
exports.getWalletCountByAddressOrToken = async function (address, token) {
    try {
        var must = []
        if (address) {
            var addressTerm = {
                match: {
                    address: address
                }
            }
            must.push(addressTerm)
        }
        if (token) {
            var tokenTerm = {
                match: {
                    token: token
                }
            }
            must.push(tokenTerm)
        }
        let res = await esClient.count({
            index: 'wallet',
            body: {
                query: {
                    bool: {
                        must: must
                    }
                }
            }
        })
        return res.count
    } catch (error) {
        logger.info("根据地址查询总数 Error,", error)
        return { result: false, msg: error }
    }
}

/**
 * @description 根据条件更新钱包数据
 * 
 */
exports.updateWalletByQuery = async function (address, token, balance) {
    try {
        let res = await esClient.updateByQuery({
            index: 'wallet',
            body: {
                query: {
                    bool: {
                        must: [{
                            match: {
                                address: address
                            }
                        }, {
                            match: {
                                token: token
                            }
                        }
                        ]
                    }
                },
                script: {
                    lang: "painless",
                    source: "ctx._source.balance=" + balance
                }
            }
        })
        return res
    } catch (error) {
        logger.info("根据条件更新钱包数据 Error,", error)
        return { result: false, msg: error }
    }
}

/**
 * @description 根据条件查询ERC20 Count
 * @param erc20 erc20
 */
exports.getErc20Count = async function (erc20) {
    try {
        var must = []
        if (erc20) {
            var erc20Term = {
                match: {
                    erc20: erc20
                }
            }
            must.push(erc20Term)
        }
        let res = await esClient.count({
            index: 'erc20',
            body: {
                query: {
                    bool: {
                        must: must
                    }
                }
            }
        })
        return res.count
    } catch (error) {
        logger.info("根据条件查询ERC20 Error," + error)
        return { result: false, msg: error }
    }
}

// 根据交易数查询BlocksCurve
exports.getBlocksCurveByTxLength = async function (txLength) {
    try {
        let res = await esClient.search({
            index: "blocksCurve",
            body: {
                query: {
                    match: {
                        trades: txLength
                    }
                }
            },
            size: 1
        })
        return res.hits.hits
    } catch (error) {
        logger.info("根据交易数查询BlocksCurve Error,", error)
        return { result: false, msg: error }
    }
}

// 根据交易数更新BlocksCurve数据 
exports.updateBlocksCurveNum = async function (txlength) {
    try {
        let res = await esClient.updateByQuery({
            index: 'blocksCurve',
            body: {
                query: {
                    bool: {
                        must: [{
                            match: {
                                trades: txlength
                            }
                        }]
                    }
                },
                script: {
                    lang: "painless",
                    source: "ctx._source.blocks++"
                }
            }
        })
        logger.info("根据交易数更新BlocksCurve数据,", res)
        return res
    } catch (error) {
        logger.info("根据交易数更新BlocksCurve数据 Error,", error)
        return { result: false, msg: error }
    }
}