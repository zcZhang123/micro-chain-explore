/**
 * Transactions.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: 'id',

  attributes: {
    nonce: { type: 'number' },
    syscnt: { type: 'number' },
    gas_price: { type: 'number' },
    gas: { type: 'number' },
    from: { type: 'string' }, // 交易发起钱包
    to: { type: 'string' }, // 交易接收钱包
    value: { type: 'number', columnType: 'Decimail128' },// 交易金额
    input: { type: 'string' },
    sharding_flag: { type: 'number' },
    via: { type: "ref" },
    hash: { type: 'string' },// 交易hash
    upper_hash: { type: 'string' },// 所属区块hash
    block_num: { type: 'string' },// 所属区块高度
    trade_type: {type:'number'} // 0:充值，1:提币，2:转账，3:其他
  },

};

