var axios = require('axios')

const api = {
    // 获取区块信息
    get_blocks_list(isLatest, page, seq) {
        return new Promise(function (resolve, reject) {
            axios.get("/api/v1/blocks/get-blocks-list?isLatest=" + isLatest + '&page=' + page + '&seq=' + seq).then((res) => {
                resolve(res.data)
            }).catch((error) => {
                reject(error)
            })
        })
    },

    // 获取交易信息
    get_transactions_list(isLatest, page, seq) {
        return new Promise(function (resolve, reject) {
            axios.get("/api/v1/transactions/get-transactions-list?isLatest=" + isLatest + '&page=' + page + '&seq=' + seq).then((res) => {
                resolve(res.data)
            }).catch((error) => {
                reject(error)
            })
        })
    },

    // 获取区块详细信息
    get_block_detail_by_hash(hash) {
        return new Promise(function (resolve, reject) {
            axios.get("/api/v1/blocks/get-blocks-detail-by-hash?hash=" + hash).then((res) => {
                console.log(res)
                resolve(res.data)
            }).catch((error) => {
                reject(error)
            })
        })
    },

    get_block_detail_by_block_num(blockNum) {
        return new Promise(function (resolve, reject) {
            axios.get("/api/v1/blocks/get-blocks-detail-by-block-num?blockNum=" + blockNum).then((res) => {
                resolve(res.data)
            }).catch((error) => {
                reject(error)
            })
        })
    },

    // 获取交易详情
    get_trade_detail_by_hash(hash) {
        return new Promise(function (resolve, reject) {
            axios.get("/api/v1/transactions/get-transaction-detail-by-hash?hash=" + hash).then((res) => {
                resolve(res.data)
            }).catch((error) => {
                reject(error)
            })
        })
    },

    // 获取hash类型
    get_hash_type(hash) {
        return new Promise(function (resolve, reject) {
            axios.get("/api/v1/get-hash-type?hash=" + hash).then((res) => {
                resolve(res.data)
            }).catch((error) => {
                reject(error)
            })
        })
    },

    // 获取钱包详情
    get_trade_adn_balance_by_address(address, tradePartner, page, seq) {
        return new Promise(function (resolve, reject) {
            axios.get("/api/v1/get-wallet-detail-by-address?address=" + address + '&tradePartner=' + tradePartner + '&page=' + page + '&seq=' + seq).then((res) => {
                console.log(res)
                resolve(res.data)
            }).catch((error) => {
                reject(error)
            })
        })
    },

    // 获取子链信息
    get_micro_chain_info() {
        return new Promise(function (resolve, reject) {
            axios.get("/api/v1/get-micro-chain-info").then((res) => {
                resolve(res.data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

}
export default api;