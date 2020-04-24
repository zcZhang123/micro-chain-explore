module.exports.config = {
    elasticsearch: {
        url: "http://127.0.0.1:9200", // es连接url
        apiVersion: "7.6", // 使用api版本，与es版本对应
        log: "error"
    },
    microChain: {
        microChain: '0x36aa307a4157653eafa47f327b11963ccf174ed4', // 应用链地址
        dappBase: '0x68b21c47a1c2ea6cb8c6d641c17603f929456240', // dapp Base地址
        vnodeUri: 'http://47.244.233.14:8545', // vnode url
        scsUri: 'http://47.244.233.14:8547', // scs url
        transfer_sha:'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    }
}