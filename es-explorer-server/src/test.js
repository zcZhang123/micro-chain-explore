const Chain3 = require("chain3")
const chain3 = new Chain3();
const { createElement, getBlockNumToES, deleteSomeBlocksByNum, deleteTransactionsByNum ,createBulkElement, getWalletCountByAddressOrToken } = require('./utils/esUtils')
const { getBlock, getReceiptByHash, getTransactionByHash } = require('./utils/moacUtils')

test()
async function test() {
    let res = await deleteTransactionsByNum(93827)
    console.log(res)
}