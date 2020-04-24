const Chain3 = require("chain3")
const chain3 = new Chain3();
const { createElement, getBlockNumToES } = require('./utils/esUtils')
const { getBlock } = require('./utils/moacUtils')

test()
async function test() {
    let res = await getBlockNumToES("blocks", "doc", data.number, data)
    console.log(res)
}