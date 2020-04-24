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
        return { result: false, msg: error }
    }
}