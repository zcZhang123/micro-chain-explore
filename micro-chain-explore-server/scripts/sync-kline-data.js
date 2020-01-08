module.exports = {

    friendlyName: 'Start synchronous kline data',

    inputs: {
    },

    exits: {
    },


    fn: async function () {
        while (true) {
            sails.log.info(new Date().toLocaleTimeString(), 'Sync kline')
            await sails.helpers.sync.syncKlineData()
            await new Promise(resolve => setTimeout(resolve, 10000))
        }
    },
};
