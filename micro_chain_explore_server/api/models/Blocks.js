/**
 * Blocks.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: 'id',

  attributes: {
    parent_hash: { type: 'string' },
    hash: { type: 'string' },
    state_root: { type: 'string' },
    transactions_root: { type: 'string' },
    receipts_root: { type: 'string' },
    block_number: { type: 'number' },
    timestamp: { type: 'number' },
    extra_data: { type: 'string' },
    reward: { type: 'number' },
    miner: { type: 'string' },
    transactions_num: {type: 'number'},
    random_int1: { type: 'number' },
    random_int2: { type: 'number' }
  },

};

