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
        logger.info("获取保存最新区块号 Error," + error)
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
        logger.info("保存数据到es Error," + error)
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
        logger.info("根据地址查询总数 Error," + error)
        return { result: false, msg: error }
    }
}

/**
 * @description 根据条件更新钱包数据
 * 
 */
exports.updateWalletByQuery = async function (address, token, balance) {
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
            script:{
                lang:"painless",
                source: "ctx._source.balance='balance'"
            }
        }
    })
}
