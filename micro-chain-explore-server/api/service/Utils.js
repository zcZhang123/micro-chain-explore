/**
 * Utils
 *
 * @description :: 共通
 */

exports._return = function (msg, result) {
    return { code: msg.code, data: result, msg: msg.msg }
}