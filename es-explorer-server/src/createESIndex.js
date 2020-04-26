const { esClient } = require('./utils/elisticClient')
function setupIndexAndMappings() {
    esClient.indices.create({ index: 'blocks' }, (err, res, status) => {
        console.log(err, res, status);
    });
    esClient.indices.create({ index: 'transactions' }, (err, res, status) => {
        console.log(err, res, status);
    });
    esClient.indices.create({ index: 'blocks_curve' }, (err, res, status) => {
        console.log(err, res, status);
    });
    esClient.indices.create({ index: 'erc20' }, (err, res, status) => {
        console.log(err, res, status);
    });
    esClient.indices.create({ index: 'wallet' }, (err, res, status) => {
        console.log(err, res, status);
    });
    esClient.indices.create({ index: 'trades_curve' }, (err, res, status) => {
        console.log(err, res, status);
    });
}
setupIndexAndMappings()