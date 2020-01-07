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

exports.getTpyeAndPrice = function (param) {
    let price
    let type
    let isBuy = _.find(pairs, (pair) => {
        return pair.base === param.get.token && pair.counter === param.give.token
    });
    if (isBuy) {
        price = new BigNumber(param.get.amount).dividedBy(new BigNumber(param.give.amount)).toString();
        type = 'buy';
        return { price, type }
    }
    price = new BigNumber(param.give.amount).dividedBy(new BigNumber(param.get.amount)).toString();
    type = 'sell';
    return { price, type }
}
