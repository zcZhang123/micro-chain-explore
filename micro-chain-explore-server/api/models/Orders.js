/**
 * Chains.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: 'id',

  attributes: {
    order_id: { type: 'string' },
    user: { type: 'string' },
    tokenGet: { type: 'string' },
    amountGet: { type: 'number' },
    tokenGive: { type: 'string' },
    amountGive: { type: 'number' },
    expires: { type: 'number' },
    nonce: { type: 'number' },
    time: { type: 'string' },
    update_index: { type: 'number' }
  },

};

