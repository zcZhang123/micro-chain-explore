const Utils = require('./Utils.js')

// 获取数据库同步区块
exports.getBlockNumToRedis = function () {
    return new Promise(function (resolve, reject) {
        try {
            Utils.redisClient.get('blockNum', function (err, data) {
                if (!err) {
                    if (data) {
                        resolve(data)
                    } else {
                        resolve(1)
                    }
                } else {
                    reject(err)
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

// 保存区块号
exports.saveBlockNum = function (blockNum) {
    return new Promise(function (resolve, reject) {
        try {
            Utils.redisClient.set('blockNum', blockNum, function (err, data) {
                if (!err) {
                    if (data == 'OK') {
                        resolve({ code: '0', msg: '保存区块号成功' })
                    } else {
                        resolve({ code: '1', msg: '保存区块号失败' })
                    }
                } else {
                    reject(err)
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

// 获取K线数据
exports.getKlineData = function (base, counter, type) {
    return new Promise(function (resolve, reject) {
        try {
            let key = base + '-' + counter + '/' + type;
            Utils.redisClient.get(key, function (err, data) {
                if (!err) {
                    if (data) {
                        resolve(JSON.parse(data))
                    } else {
                        resolve([])
                    }

                } else {
                    reject(err)
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

// 保存分析的K线数据
exports.saveKlineData = function (base, counter, type, klineData) {
    return new Promise(function (resolve, reject) {
        try {
            let key = base + '-' + counter + '/' + type;
            Utils.redisClient.set(key, JSON.stringify(klineData), function (err, data) {
                if (!err) {
                    resolve(data)
                } else {
                    reject(err)
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}