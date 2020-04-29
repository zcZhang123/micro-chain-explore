const uuidv4 = require('uuid/v4');
var logger = require('./logger')
const { esClient } = require("./elisticClient")

/**
 * 获取保存最新区块号
 */
exports.getBlockNumToES = async function () {
    try {
        let res1 = await esClient.search({
            index: "blocks",
            body: {
                query: {
                    match_all: {}
                }
            },
            size: 1
        })
        let blockInfo = res1.hits.hits
        if (blockInfo.length > 0) {
            let res2 = await esClient.search({
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
            return res2.hits.hits[0]._source.number
        }
        return 1
    } catch (error) {
        logger.error("获取保存最新区块号 Error,", error)
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
        logger.error("保存数据到es Error,", error)
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
        return res
    } catch (error) {
        logger.error("批量保存数据到es Error,", error)
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
        logger.error("根据地址查询总数 Error,", error)
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
        logger.info("参数address：" + address, ",   token：" + token + ",   balance：" + balance)
        logger.error("根据条件更新钱包数据 Error,", error)
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
        logger.error("根据条件查询ERC20 Count Error," + error)
        return { result: false, msg: error }
    }
}

// 根据条件查询ERC20 Data
exports.getERC20Data = async function (erc20) {
    try {
        let res = await esClient.search({
            index: "erc20",
            body: {
                query: {
                    match: {
                        erc20: erc20
                    }
                }
            },
            size: 1
        })
        return res.hits.hits
    } catch (error) {
        logger.error("根据条件查询ERC20 Data Error," + error)
        return { result: false, msg: error }
    }
}

// 根据交易数查询BlocksCurve
exports.getBlocksCurveByTxLength = async function (txLength) {
    try {
        let res = await esClient.search({
            index: "blocks_curve",
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
        logger.error("根据交易数查询BlocksCurve Error,", error)
        return { result: false, msg: error }
    }
}

// 根据交易数更新BlocksCurve数据 
exports.updateBlocksCurveNum = async function (txlength) {
    try {
        let res = await esClient.updateByQuery({
            index: 'blocks_curve',
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
        return res
    } catch (error) {
        logger.info("参数为：", txlength)
        logger.error("根据交易数更新BlocksCurve数据 Error,", error)
        return { result: false, msg: error }
    }
}

// 根据hash获取交易数
exports.getTransactionsCountByHash = async function (hash) {
    try {
        var must = []
        if (hash) {
            var hashTerm = {
                match: {
                    transaction_hash: hash
                }
            }
            must.push(hashTerm)
        }
        let res = await esClient.count({
            index: 'transactions',
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
        logger.error("根据hash获取交易数 Error,", error)
        return { result: false, msg: error }
    }
}

// 根据区块号删除区块信息
exports.deleteBlocksByNum = async function (number) {
    try {
        let res = await esClient.deleteByQuery({
            index: 'blocks',
            body: {
                query: {
                    term: {
                        number: number
                    }
                }
            }
        })
        return res
    } catch (error) {
        logger.error("根据区块号删除区块信息 Error,", error)
        return { result: false, msg: error }
    }
}

// 删除大于区块号的区块数据
exports.deleteSomeBlocksByNum = async function (number) {
    try {
        let res = await esClient.deleteByQuery({
            index: 'blocks',
            body: {
                query: {
                    range: {
                        number: {
                            gt: number
                        }
                    }
                }
            }
        })
        return res
    } catch (error) {
        logger.error("删除大于区块号的区块数据 Error,", error)
        return { result: false, msg: error }
    }
}

// 根据区块号删除交易记录
exports.deleteTransactionsByNum = async function (number) {
    try {
        let res = await esClient.deleteByQuery({
            index: 'transactions',
            body: {
                query: {
                    term: {
                        block_number: number
                    }
                }
            }
        })
        return res
    } catch (error) {
        logger.error("根据区块号删除区块信息 Error,", error)
        return { result: false, msg: error }
    }
}

/**
 * @description 保存/更新 每日交易数
 */
exports.saveTradeCurveData = async function (time, num) {
    try {
        let timeStr = formatTime(time)
        // 判断该时间是否存在
        let res1 = await esClient.search({
            index: "trades_curve",
            body: {
                query: {
                    match: {
                        time: timeStr
                    }
                }
            }
        })
        // 存在，更新记录
        if (res1.hits.hits.length > 0) {
            let count = res1.hits.hits[0]._source.count + num
            esClient.updateByQuery({
                index: 'trades_curve',
                body: {
                    query: {
                        match: {
                            time: timeStr
                        }
                    },
                    script: {
                        lang: "painless",
                        source: "ctx._source.count=" + count
                    }
                }
            })
        } else { // 不存在，新建记录
            let id = uuidv4().replace(/-/g, "");
            await exports.createElement("trades_curve", "doc", id, { time: timeStr, count: num, timestamp: time })
        }
    } catch (error) {
        logger.info("时间为：", time + ">>>>> num为：  ", num)
        logger.error("保存/更新 每日交易数 Error,", error)
        return { result: false, msg: error }
    }
}

// 格式化时间戳>>> "2020-01-01"
function formatTime(time) {
    let unixtime = time * 1000;
    let unixTimestamp = new Date(unixtime);
    let Y = unixTimestamp.getFullYear();
    let M =
        unixTimestamp.getMonth() + 1 >= 10
            ? unixTimestamp.getMonth() + 1
            : '0' + (unixTimestamp.getMonth() + 1);
    let D =
        unixTimestamp.getDate() >= 10
            ? unixTimestamp.getDate()
            : '0' + unixTimestamp.getDate();
    let toDay = Y + '-' + M + '-' + D;
    return toDay;
}