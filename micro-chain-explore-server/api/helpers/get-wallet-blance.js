var http = require('http');
var https = require('https');
var config = require('../config.json')
module.exports = {

  friendlyName: 'Get wallet blance',

  description: '',

  inputs: {
    address: {
      type: 'string'
    }
  },

  exits: {
  },

  fn: async function ({ address }) {
    var data = {
      jsonrpc: '2.0',
      id: 0,
      method: 'ScsRPCMethod.GetBalance',
      params:
      {
        SubChainAddr: config.SubChainAddr,
        Sender: address
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
    var link;
    if (options.host.indexOf('https://') == -1) {
      link = http
    } else {
      link = https
    }
    return new Promise(function (resolve, reject) {
      var req = link.request(options, function (res) {
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

