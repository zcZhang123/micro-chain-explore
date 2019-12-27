const abiDecoder = require('abi-decoder');
const Chain3 = require('chain3');

var chain3 = new Chain3(new Chain3.providers.HttpProvider('https://moac10jc5f041.jccdex.cn:8550'));
chain3.setScsProvider(new Chain3.providers.HttpProvider('http://59.111.104.18:8547'));

const dappABI = '[{"constant":true,"inputs":[{"name":"addrs","type":"address[]"},{"name":"addr","type":"address"}],"name":"have","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pos","type":"uint256"},{"name":"tosend","type":"address[]"},{"name":"amount","type":"uint256[]"},{"name":"times","type":"uint256[]"}],"name":"postFlush","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"dappAddr","type":"address"}],"name":"getDappABI","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dappAddr","type":"address"},{"name":"dappOwner","type":"address"},{"name":"dappABI","type":"string"},{"name":"state","type":"uint256"}],"name":"updateDapp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newlist","type":"address[]"}],"name":"updateNodeList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"userAddr","type":"address"},{"name":"pos","type":"uint256"}],"name":"getRedeemMapping","outputs":[{"name":"redeemingAddr","type":"address[]"},{"name":"redeemingAmt","type":"uint256[]"},{"name":"redeemingtime","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurNodeList","outputs":[{"name":"nodeList","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"curNodeList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"userAddr","type":"address"}],"name":"getEnterRecords","outputs":[{"name":"enterAmt","type":"uint256[]"},{"name":"entertime","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dappAddr","type":"address"}],"name":"removeDapp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getDappList","outputs":[{"components":[{"name":"dappAddr","type":"address"},{"name":"owner","type":"address"},{"name":"dappABI","type":"string"},{"name":"state","type":"uint256"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"dappRecord","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"dappAddr","type":"address"}],"name":"getDappState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"dappList","outputs":[{"name":"dappAddr","type":"address"},{"name":"owner","type":"address"},{"name":"dappABI","type":"string"},{"name":"state","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"redeemFromMicroChain","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"coinName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allDeploySwitch","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dappAddr","type":"address"},{"name":"dappOwner","type":"address"},{"name":"dappABI","type":"string"}],"name":"registerDapp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"enterPos","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_switch","type":"bool"}],"payable":true,"stateMutability":"payable","type":"constructor"}]'
var mcObject = chain3.microchain();
mcObject.setVnodeAddress(process.env.VIA);
var dappBase = mcObject.getDapp(process.env.MICRO_CHAIN, JSON.parse(dappABI), process.env.DAPP_BASE_ADDR);

export const formatTime = (t) => {
    let unixtime = t * 1000;
    let unixTimestamp = new Date(unixtime);
    let Y = unixTimestamp.getFullYear();
    let M =
        unixTimestamp.getMonth() + 1 >= 10
            ? unixTimestamp.getMonth() + 1
            : '0' + (unixTimestamp.getMonth() + 1);
    let D =
        unixTimestamp.getDate() >= 10
            ? unixTimestamp.getDate()
            : '0' + unixTimestamp.getDate();
    let H = unixTimestamp.getHours();
    let mm = unixTimestamp.getMinutes();
    let ss = unixTimestamp.getSeconds();
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (ss < 10) {
        ss = '0' + ss;
    }
    let toDay = Y + '-' + M + '-' + D + '  ' + H + ':' + mm + ":" + ss;
    return toDay;
};

export const decodeInput = (input, contractAddr) => {
    try {
        if (contractAddr.toLowerCase() === process.env.DAPP_BASE_ADDR) {
            abiDecoder.addABI(JSON.parse(dappABI));
        } else if (input.length > 2 && input.substr(0, 2) !== '0x') {
            abiDecoder.addABI(JSON.parse(dappBase.getDappABI(contractAddr)));
        } else {
            return
        }
        let _input = '0x' + input;
        let decodedData = abiDecoder.decodeMethod(_input);
        console.log(decodedData);
        let decode = 'Function:' + decodedData['name'] + '\n';
        let params = decodedData['params'];
        for (var i = 0, length = params.length; i < length; i++) {
            decode = decode + params[i]['name'] + ":" + params[i]['value'] + '\n'
        }
        return decode;
    } catch (error) {
        console.log(error);
    }
};

export { chain3 }