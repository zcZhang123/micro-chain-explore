const Chain3 = require("chain3")
const chain3 = new Chain3();
const { createElement, getBlockNumToES, getCount, createBulkElement } = require('./utils/esUtils')
const { getBlock, getReceiptByHash, getTransactionByHash } = require('./utils/moacUtils')

test()
async function test() {
    let datas = [{
        blockHash: '0x82e25b9a7edd75cfd6ff3b73e0732b0d6b9fb70ae7e0e3e456027851e80e9796',
        blockNumber: '123',
        from: '0x729e68f150f2bd2bee005d992c5a3d479eafeab9',
        input: '0x1652a76c60a73467109527dfa06d306ddb01aa89a9059cbb000000000000000000000000121cb01dc4089e83c5a8b8c559d7f9ee0e84bba500000000000000000000000000000000000000000000000f5d68be501a840000',
        nonce: 9622,
        r: "3.1795531768897193e+75",
        s: "3.8343097919324076e+76",
        shardingFlag: 1,
        to: '0x36aa307a4157653eafa47f327b11963ccf174ed4',
        transactionHash: '0x43ece1f33519596ede6cb71197afa3032888b7f45d7e0fbaf42133c11c2fc5bd',
        transactionIndex: '0x0',
        v: 234,
        value: 0
      },{
        blockHash: '0x82e25b9a7edd75cfd6ff3b73e0732b0d6b9fb70ae7e0e3e456027851e80e9796',
        blockNumber: '1234',
        from: '0x729e68f150f2bd2bee005d992c5a3d479eafeab9',
        input: '0x1652a76c60a73467109527dfa06d306ddb01aa89a9059cbb000000000000000000000000121cb01dc4089e83c5a8b8c559d7f9ee0e84bba500000000000000000000000000000000000000000000000f5d68be501a840000',
        nonce: 9622,
        r: "3.1795531768897193e+75",
        s: "3.8343097919324076e+76",
        shardingFlag: 1,
        to: '0x36aa307a4157653eafa47f327b11963ccf174ed4',
        transactionHash: '0x43ece1f33519596ede6cb71197afa3032888b7f45d7e0fbaf42133c11c2fc5bd',
        transactionIndex: '0x0',
        v: 234,
        value: 0
      }]
    let res = await createBulkElement("transactionstest",'test', datas)
    console.log(res)
}