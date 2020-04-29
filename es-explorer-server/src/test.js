const Chain3 = require("chain3")
const chain3 = new Chain3();
const { createElement, getBlockNumToES, deleteBlocksByNum, deleteSomeBlocksByNum, deleteTransactionsByNum ,createBulkElement, getWalletCountByAddressOrToken } = require('./utils/esUtils')
const { getBlock, getReceiptByHash, getTransactionByHash } = require('./utils/moacUtils')

test()
async function test() {
    let res = await deleteBlocksByNum(1)
    console.log(res)
}