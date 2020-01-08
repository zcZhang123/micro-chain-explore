const Chain3 = require('chain3')
const BigNumber = require('bignumber.js')
var pairs = require('../../assets/config/pairs.json')

var chain3 = new Chain3()
chain3.setProvider(new chain3.providers.HttpProvider(sails.config.custom.vnodeUri))
chain3.setScsProvider(new chain3.providers.HttpProvider(sails.config.custom.scsUri))

exports.chain3 = chain3

exports._return = function (msg, result) {
    return { code: msg.code, data: result, msg: msg.msg }
}

exports.getTypeAndPrice = function (param) {
    let price
    let type
    let base
    let counter
    let isSell = _.find(pairs, (pair) => {
        return pair.base === param.get.token && pair.counter === param.give.token
    });
    if (isSell) {
        price = new BigNumber(param.give.amount).dividedBy(new BigNumber(param.get.amount)).toString();
        type = 'sell';
        base = param.get.amount
        counter = param.give.amount
        return { price, type, base, counter }
    }
    price = new BigNumber(param.get.amount).dividedBy(new BigNumber(param.give.amount)).toString();
    type = 'buy';
    base = param.give.amount
    counter = param.get.amount
    return { price, type, base, counter }
}


const redis = require('redis');

const redisClient = redis.createClient(sails.config.custom.redisPort, sails.config.custom.redisHost);
redisClient.auth(123456);

exports.redisClient = redisClient;

// 获取当天零点的时间戳
exports.getTodayTimestamp = function () {
    let date = new Date()
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0)
    var time = date.getTime()
    return time;
}

// 判断K线是否需要创建新的数据
exports.isNewCycle = function (timestamp, newTimestamp, cycle, offset) {
    if (cycle != 'month' || cycle != 'year') {
        if (timestamp <= newTimestamp - offset) {
            return true
        } else {
            return false
        }
    } else {
        let time = new Date(timestamp);
        let year = time.getFullYear();
        let month = time.getMonth();
        let newTime = new Date(newTimestamp);
        let newYear = time.getFullYear();
        let newMonth = newTime.getMonth();
        if (cycle == 'month') {
            if (newYear > year) {
                return true
            } else {
                if (newMonth > month) {
                    return true
                } else {
                    return false
                }
            }
        } else if (cycle == 'year') {
            if (newYear > year) {
                return true
            } else {
                return false
            }
        }
    }
}

// 根据K线周期返回新的时间戳
exports.getTimeByCycle = function (timestamp, cycle) {
    let unixTimestamp = new Date(timestamp);
    let time = timestamp;
    let seconds = unixTimestamp.getSeconds();
    let minute = unixTimestamp.getMinutes();
    let hour = unixTimestamp.getHours();
    let month = unixTimestamp.getMonth();
    let year = unixTimestamp.getFullYear();
    let remainder = 0; // 余数
    if (cycle.indexOf('minute') != -1) {
        if (cycle == '5minute') {
            remainder = minute % 5;
        } else if (cycle == '15minute') {
            remainder = minute % 15;
        } else if (cycle == '30minute') {
            remainder = minute % 30
        }
        time = timestamp - (remainder * 60000) - (seconds * 1000);
    } else if (cycle.indexOf('hour') != -1) {
        if (cycle == '4hour') {
            remainder = hour % 4
        }
        time = timestamp - (remainder * 3600000) - (minute * 60000) - (seconds * 1000)
    } else if (cycle == 'day' || cycle == 'week') {
        if (cycle == 'week') {
            let dayInWeek = unixTimestamp.getDay()
            if (dayInWeek == 0) {
                remainder = 6
            } else {
                remainder = dayInWeek - 1
            }
        }
        time = timestamp - (remainder * 86400000) - (hour * 3600000) - (minute * 60000) - (seconds * 1000)
    } else if (cycle == 'month') {
        time = new Date(year, month, 1, 0, 0, 0, 0).getTime();
    } else if (cycle == 'year') {
        time = new Date(year, 0, 1, 0, 0, 0, 0).getTime();
    }
    return time;
}

// 判断交易类型是否是交易挂单
exports.isTrade = function (input) {
    let address = input.substr(0, 42)
    if (address != sails.config.custom.ethdAddr) {
        return false
    }
    let data = input.substr(42, 8)
    if (data == sails.config.custom.trade) {
        return true
    } else {
        return false
    }
}