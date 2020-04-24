const Chain3 = require("chain3")
const chain3 = new Chain3();
const { createElement, getBlockNumToES, getCount } = require('./utils/esUtils')
const { getBlock, getReceiptByHash, getTransactionByHash } = require('./utils/moacUtils')

test()
async function test() {
    let res = await getCount(801234)
    console.log(res)
}