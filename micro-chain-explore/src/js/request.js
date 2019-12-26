import api from './api'

/**
 *
 * @param {*} isLatest 获取区块数据，true:首页数据，返回6条；false:获取指定区块数据
 * @param {*} page     当前页数，从0开始
 * @param {*} seq   每页显示条数
 */
export const getBlocksList = async (isLatest, page, seq) => {
    try {
        let res = await api.get_blocks_list(isLatest, page, seq);
        if (res.code === '0') {
            return res.data
        }
    } catch (error) {
        return error
    }
}

/**
 *
 * @param {*} isLatest 获取区块数据，true:首页数据，返回6条；false:获取指定区块数据
 * @param {*} page     当前页数，从0开始
 * @param {*} seq   每页显示条数
 */
export const getTransactionsList = async (isLatest, page, seq) => {
    try {
        let res = await api.get_transactions_list(isLatest, page, seq);
        if (res.code === '0') {
            return res.data
        }
    } catch (error) {
        return error
    }
}

/**
 * 根据区块hash查询区块详细信息
 * @param  hash 区块hash
 */
export const getBlockDetailByHash = async (hash) => {
    try {
        let res = await api.get_block_detail_by_hash(hash);
        if (res.code === '0') {
            return res.data
        }
    } catch (error) {
        return error
    }
}

/**
 * 根据区块高度获取区块详情
 * @param  blockNum
 */
export const getBlockDetailByBlockNum = async (blockNum) => {
    try {
        let res = await api.get_block_detail_by_block_num(blockNum);
        if (res.code === '0') {
            return res.data
        }
    } catch (error) {
        return error
    }
}

/**
 * 根据交易hash查询交易详情
 * @param  hash 交易hash
 */
export const getTradeDetailByHash = async (hash) => {
    try {
        let res = await api.get_trade_detail_by_hash(hash);
        if (res.code === '0') {
            return res.data
        }
    } catch (error) {
        return error
    }
}

/**
 * 获取查询hash类型
 * @param  hash
 */
export const getHashType = async (hash) => {
    try {
        let res = await api.get_hash_type(hash);
        if (res.code === '0') {
            return res.data.type
        }
    } catch (error) {
        return error
    }
}

/**
 * 获取钱包余额、交易
 * @param  address
 */
export const getTradeAndBalanceByAddress = async (address, currentPage, defaultPageSize) => {
    try {
        let res = await api.get_trade_adn_balance_by_address(address, currentPage, defaultPageSize);
        if (res.code === '0') {
            return res.data
        }
    } catch (error) {
        return error
    }
}

/**
 * 获取子链信息
 */
export const getMicroChainInfo = async () => {
    try {
        let res = await api.get_micro_chain_info();
        if (res.code === '0') {
            return res.data
        }
    } catch (error) {
        return error
    }
}