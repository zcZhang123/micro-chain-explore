var http = require('http');
var config = require('../config.json')
module.exports = {

  friendlyName: 'Get sub chain info',

  description: '',

  inputs: {
  },

  exits: {
  },

  fn: async function () {
    var data = {
      jsonrpc: '2.0',
      id: 0,
      method: 'ScsRPCMethod.GetSubChainInfo',
      params:
      {
        SubChainAddr: config.SubChainAddr
      }
    }
    var content = JSON.stringify(data)

    var options = {
      host: config.host,
      port: config.port,
      method: 'POST',
      path: '/rpc',
      headers: {
        "Content-Type": 'application/json',
        "Accept": "application/json"
      }
    }
    return new Promise(function (resolve, reject) {
      var req = http.request(options, function (res) {
        var _data = '';
        res.on('data', function (chunk) {
          _data += chunk;
        });
        res.on('end', function () {
          resolve(JSON.parse(_data).result)
        });
      }).on('error', function (e) {
        reject(e)
      })
      req.write(content);
      req.end();
    })
  }


};

