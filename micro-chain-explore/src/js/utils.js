const abiDecoder = require('abi-decoder');
const Chain3 = require('chain3');

var chain3 = new Chain3(new Chain3.providers.HttpProvider(process.env.VNODE_URI));
chain3.setScsProvider(new Chain3.providers.HttpProvider(process.env.SCS_URI));

var mcObject = chain3.microchain();
mcObject.setVnodeAddress(process.env.VIA);
var dappBase = mcObject.getDapp(process.env.MICRO_CHAIN, process.env.DAPP_BASE_ABI, process.env.DAPP_BASE_ADDR);

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

export const decodeInput = (input, to) => {
    try {
        let encode;
        if (to.toLowerCase() === process.env.MICRO_CHAIN.toLowerCase()) {
            abiDecoder.addABI(process.env.ASM_MICRO_CHAIN_ABI);
            encode = input;
        } else if (to.toLowerCase() === process.env.DAPP_BASE_ADDR.toLowerCase()) {
            abiDecoder.addABI(process.env.DAPP_BASE_ABI);
            encode = '0x' + input.slice(42);
        } else {
            encode = '0x' + input.slice(42);
            abiDecoder.addABI(JSON.parse(dappBase.getDappABI(to)));
        }

        let decodedData = abiDecoder.decodeMethod(encode);
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