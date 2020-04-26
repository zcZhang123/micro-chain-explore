const { config } = require("../config/config")
const Chain3 = require("chain3")
const chain3 = new Chain3();
const uuidv4 = require('uuid/v4');
const abiDecoder = require('abi-decoder');
const Web3EthAbi = require('web3-eth-abi');
var logger = require('./logger')
const axios = require("axios");
const fetch = axios.create({ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });
const url = config.microChain.scsUri
const { getWalletCountByAddressOrToken, createElement, updateWalletByQuery, getErc20Count } = require("./esUtils")

abiDecoder.addABI(JSON.parse(config.microChain.ASM_MICRO_CHAIN_ABI));
abiDecoder.addABI(JSON.parse(config.microChain.DAPP_BASE_ABI));
abiDecoder.addABI(JSON.parse(config.microChain.ERC20ABI));

// 获取最新区块
exports.getBlockNumber = async function () {
    var data = {
        jsonrpc: '2.0',
        id: 0,
        method: 'scs_getBlockNumber',
        params:
            [config.microChain.microChain]
    }
    var res = await fetch.post(url, JSON.stringify(data))
    return chain3.toDecimal(res.data.result)
}

// 获取指定区块信息
exports.getBlock = async function (blockNum) {
    let num = chain3.toHex(blockNum)
    var data = {
        jsonrpc: '2.0',
        id: 0,
        method: 'scs_getBlock',
        params:
            [config.microChain.microChain, num]
    }
    var res = await fetch.post(url, JSON.stringify(data))
    return res.data.result;
}

// 获取指定交易收据
exports.getReceiptByHash = async function (txHash) {
    var data = {
        jsonrpc: '2.0',
        id: 0,
        method: 'scs_getReceiptByHash',
        params:
            [config.microChain.microChain, txHash]
    }
    let res = await fetch.post(url, JSON.stringify(data));
    return res.data.result;
}

// 获取指定交易信息
exports.getTransactionByHash = async function (txHash) {
    var data = {
        jsonrpc: '2.0',
        id: 0,
        method: 'scs_getTransactionByHash',
        params:
            [config.microChain.microChain, txHash]
    }
    let res = await fetch.post(url, JSON.stringify(data));
    return res.data.result;
}

exports.addWalletFromInput = async (tx) => {
    try {
        var wallets = new Set();
        var input = tx.input;
        var to = tx.to;
        var abi;
        wallets.add(tx.from);
        wallets.add(to);
        if (tx.sharding_flag === 1) {
            let encode;
            if (to.toLowerCase() === config.microChain.microChain.toLowerCase()) {
                encode = input;
            } else if (to.toLowerCase() === config.microChain.dappBase.toLowerCase()) {
                encode = '0x' + input.slice(42);
            } else {
                encode = '0x' + input.slice(42);
                abi = await getDappABI(to);
                if (abi) {
                    abiDecoder.addABI(JSON.parse(abi));
                } else {
                    // 查询erc20数据Count
                    // let count = await ERC20.count({ erc20: to });
                    let count = await getErc20Count(to)
                    if (count != 1) {
                        return
                    }
                }
            }
            let decodedData = abiDecoder.decodeMethod(encode);
            if (decodedData) {
                let params = decodedData['params'];
                let address = _.filter(params, (param) => {
                    return param.type === 'address' || param.type === 'address[]'
                });
                for (let i = 0, length = address.length; i < length; i++) {
                    let wallet = address[i]['value'];
                    if (Array.isArray(wallet)) {
                        for (let i = 0, length = wallet.length; i < length; i++) {
                            wallets.add(wallet[i])
                        }
                    } else {
                        wallets.add(wallet)
                    }
                }
            }
        }
        for (let address of wallets) {
            // 查询该钱包是否已存在
            let isHas = await getWalletCountByAddressOrToken(address)
            if (isHas == 0) {
                // 保存该钱包信息
                var walletId = uuidv4().replace(/-/g, "");
                await createElement("wallet", "doc", walletId, { address: address })
            }
        }
        if (abi) {
            abiDecoder.removeABI(JSON.parse(abi));
        }
    } catch (error) {
        logger.info(error)
    }
};

exports.getBalance = async (address, token, decimals) => {
    var data = chain3.sha3('balanceOf(address)').substr(0, 10)
        + chain3.encodeParams(['address'], [address]);
    let params = JSON.stringify({ "jsonrpc": "2.0", "method": "scs_directCall", "params": [{ "to": config.microChain.microChain, "dappAddr": token, "data": data }], "id": Math.floor((Math.random() * 100) + 1) })
    let response = await fetch.post(config.microChain.scsUri, params);
    let res = Web3EthAbi.decodeParameter('uint256', response.data.result);
    let balance = new BigNumber(res).div(10 ** decimals).toNumber();
    // 根据条件查询钱包count
    let count = await getWalletCountByAddressOrToken({ address: address, token: token });
    if (count == 0) {
        // 添加钱包数据
        // await Wallet.create({ address: address, token: token, balance: balance });
        var walletId = uuidv4().replace(/-/g, "");
        await createElement("wallet", "doc", walletId, { address: address, token: token, balance: balance })
    } else {
        // 更新钱包数据
        // await Wallet.update({ address: address, token: token }).set({ token: token, balance: balance });
        await updateWalletByQuery(address, token, balance)
    }
}

// 获取dapp ABI
const getDappABI = async (dapp) => {
    return new Promise((resolve, reject) => {
        let data = "0x21e0d2d4000000000000000000000000" + dapp.substr(2);
        let params = JSON.stringify({ "jsonrpc": "2.0", "method": "scs_directCall", "params": [{ "to": config.microChain.microChain, "dappAddr": config.microChain.dappBase, "data": data }], "id": Math.floor((Math.random() * 100) + 1) })
        fetch.post(config.microChain.scsUri, params).then(function (response) {
            let abi = Web3EthAbi.decodeParameter('string', response.data.result);
            resolve(abi);
        }).catch(function (error) {
            reject(error);
        });
    })
}

// 判断是否是ERC20
exports.isERC20 = async function (dappAddr) {
    try {
        let name = await getName(dappAddr);
        let symbol = await getSymbol(dappAddr);
        let decimals = await getDecimals(dappAddr);
        let _totalSupply = await getTotalSupply(dappAddr);
        let totalSupply = new BigNumber(_totalSupply).div(10 ** decimals).toString();
        if (name && symbol && decimals) {
            return { name: name, symbol: symbol, decimals: decimals, totalSupply: totalSupply }
        }
        return
    } catch (error) {
        console.log(error)
    }
}

// 获取Token名称
const getName = async (token) => {
    var data = chain3.sha3('name()').substr(0, 10);
    let params = JSON.stringify({ "jsonrpc": "2.0", "method": "scs_directCall", "params": [{ "to": config.microChain.microChain, "dappAddr": token, "data": data }], "id": Math.floor((Math.random() * 100) + 1) })
    let response = await fetch.post(config.microChain.scsUri, params);
    if (!response.data.result) {
        return
    }
    let name = Web3EthAbi.decodeParameter('string', response.data.result);
    return name;
}

// 获取Token代称
const getSymbol = async (token) => {
    var data = chain3.sha3('symbol()').substr(0, 10);
    let params = JSON.stringify({ "jsonrpc": "2.0", "method": "scs_directCall", "params": [{ "to": config.microChain.microChain, "dappAddr": token, "data": data }], "id": Math.floor((Math.random() * 100) + 1) })
    let response = await fetch.post(config.microChain.scsUri, params);
    if (!response.data.result) {
        return
    }
    let symbol = Web3EthAbi.decodeParameter('string', response.data.result);
    return symbol;
}

// 获取Token精度
const getDecimals = async (token) => {
    var data = chain3.sha3('decimals()').substr(0, 10);
    let params = JSON.stringify({ "jsonrpc": "2.0", "method": "scs_directCall", "params": [{ "to": config.microChain.microChain, "dappAddr": token, "data": data }], "id": Math.floor((Math.random() * 100) + 1) })
    let response = await fetch.post(config.microChain.scsUri, params);
    if (!response.data.result) {
        return
    }
    let decimals = Web3EthAbi.decodeParameter('uint8', response.data.result);
    return decimals;
}

// 获取Token总量
const getTotalSupply = async (token) => {
    var data = chain3.sha3('totalSupply()').substr(0, 10);
    let params = JSON.stringify({ "jsonrpc": "2.0", "method": "scs_directCall", "params": [{ "to": config.microChain.microChain, "dappAddr": token, "data": data }], "id": Math.floor((Math.random() * 100) + 1) })
    let response = await fetch.post(config.microChain.scsUri, params);
    if (!response.data.result) {
        return
    }
    let totalSupply = Web3EthAbi.decodeParameter('uint256', response.data.result);
    return totalSupply;
}