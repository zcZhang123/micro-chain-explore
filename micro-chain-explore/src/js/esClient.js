const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
    host: process.env.ES_URL,
    log: process.env.ES_LOG,
    apiVersion: process.env.ES_API_VERSION
});

esClient.ping({
    requestTimeout: 100000
}, function (error) {
    if (error) {
        console.log('elasticsearch cluster is down!');
    }
})

export default esClient;
