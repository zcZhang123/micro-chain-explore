const Chain3 = require('chain3')

var chain3 = new Chain3()
chain3.setProvider(new chain3.providers.HttpProvider(sails.config.custom.vnodeUri))
chain3.setScsProvider(new chain3.providers.HttpProvider(sails.config.custom.scsUri))

exports.chain3 = chain3

exports._return = function (msg, result) {
    return { code: msg.code, data: result, msg: msg.msg }
}
