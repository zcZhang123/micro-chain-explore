const Chain3 = require('chain3')

var chain3 = new Chain3()
chain3.setProvider(new chain3.providers.HttpProvider(sails.config.custom.vnodeUri))
chain3.setScsProvider(new chain3.providers.HttpProvider(sails.config.custom.scsUri))

exports.chain3 = chain3

exports._return = function (msg, result) {
    return { code: msg.code, data: result, msg: msg.msg }
}


const redis = require('redis');

const redisClient = redis.createClient(sails.config.custom.redisPort, sails.config.custom.redisHost);
redisClient.auth(123456);

exports.redisClient = redisClient;

exports.getTodayTimestamp = function () {
    let date = new Date()
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0)
    var time = date.getTime()
    return time;
}