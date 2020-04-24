const elasticsearch = require('elasticsearch');
const { config } = require('../../config/config')

const client = new elasticsearch.Client({
    host: config.elasticsearch.url,
    log: config.elasticsearch.log,
    apiVersion: config.elasticsearch.apiVersion
});

client.ping({
    requestTimeout: 100000
}, function (error) {
    if (error) {
        console.log('elasticsearch cluster is down!');
    }
})

exports.esClient = client;
