/**
 * Chains.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: 'id',

  attributes: {
    sender: { type: 'string' },
    block_number: {type: 'number'}, // 最新区块
    block_number_db: {type: 'number'}, // 数据库当前存储最新区块
    scs_list: { type: 'json' },
    balance: { type: 'number' }, // 余额
    bond_limit: { type: 'number' },
    block_reward: { type: 'number' },
    tx_reward: { type: 'number' },
    via_reward: { type: 'number' }

  },

};

