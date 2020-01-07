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
    order_type: {
      type: 'number',
      description: '0:create, 1:trade, 2:cancel'
    },
    type: { type: 'string' },
    user: { type: 'string' },
    tokenGet: { type: 'string' },
    amountGet: { type: 'string' },
    tokenGive: { type: 'string' },
    amountGive: { type: 'string' },
    price: { type: 'string' },
    expires: { type: 'number' },
    nonce: { type: 'number' },
    amount: { type: 'string' },
    time: { type: 'string' },
    update_index: {
      type: 'number',
      description: 'save the latest update index'
    }
  },

};

