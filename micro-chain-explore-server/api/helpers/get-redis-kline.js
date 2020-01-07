module.exports = {

  friendlyName: 'Get kline by redis',

  description: '',

  inputs: {
    key: {
      type: 'string'
    }
  },

  exits: {
  },


  fn: async function ({ key }) {
    return new Promise(function (resolve, reject) {
      Utils.redisClient.get(key, function (err, data) {
        if (!err) {
          if (data) {
            resolve(JSON.parse(data))
          } else {
            resolve([])
          }
        } else {
          reject(err)
        }
      })
    })
  }
};

