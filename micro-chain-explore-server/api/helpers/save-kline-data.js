const BigNumber = require('bignumber.js')

module.exports = {

  friendlyName: 'Save kline data',

  description: '',

  inputs: {
    tradeDetails: {
      type: 'json'
    }

  },

  exits: {
  },

  fn: async function ({ tradeDetails }) {
    return new Promise( async function (resolve, reject) {
      try {
        let timestamp = tradeDetails.timestamp * 1000; // 成交时间
        let base = tradeDetails.params[0].value; // GetTokenAddress
        let baseAmount = new BigNumber(Utils.chain3.fromSha(tradeDetails.params[1].value)); // GetTokenAmount
        let counter = tradeDetails.params[2].value; // GiveTokenAddress
        let counterAmount = new BigNumber(Utils.chain3.fromSha(tradeDetails.params[3].value)); // GiveTokenAmount
        let price = counterAmount.dividedBy(baseAmount);   // 价格
        let volume = new BigNumber(Utils.chain3.fromSha(tradeDetails.params[10].value)); // 成交量
        let amount = price.multipliedBy(volume); // 成交金额
        const cycle = config.klineCycle;
        for (let i = 0, len = cycle.length; i < len; i++) {
          let klineData = await getKlineData(base, counter, cycle[i].name) // 获取K线数据
          let newKlineData = []; // 分析出最新的一条K线数据
          if (klineData && klineData.length > 0) { // 币种对在周期内有数据
            let lastData = klineData.pop(); // 删除并返回K线的最后一条历史数据
            let newTimestamp = getTimeByCycle(timestamp, cycle[i].name) // 获取保存的时间戳，创建新的数据时用
            let isCreateNewData = isNewCycle(lastData[0], timestamp, cycle[i].name, cycle[i].value)
            if (isCreateNewData) { // 创建新的一条K线数据
              klineData.push(lastData); // 将取出的最后一条数据重新添加到K线数据中
              newKlineData = [newTimestamp, price.toString(), price.toString(), price.toString(), price.toString(), amount.toString(), volume.toString(), 1]
              klineData.push(newKlineData); // 将创建的新数据添加到K线数据中
              await saveKlineData(base, counter, cycle[i].name, klineData); // 保存更新后的K线数据
            } else { // 更新上次的数据
              let openPrice = lastData[1];
              let closePrice = price.toString();
              let minPrice = parseFloat(lastData[3]) > parseFloat(price.toString()) ? price.toString() : lastData[3];
              let maxPrice = parseFloat(lastData[4]) > parseFloat(price.toString()) ? lastData[4] : price.toString();
              let newAmount = amount.plus(parseFloat(lastData[5]));
              let newVolume = volume.plus(parseFloat(lastData[6]));
              newKlineData = [lastData[0], openPrice, closePrice, minPrice, maxPrice, newAmount.toString(), newVolume.toString(), lastData[7] + 1];
              klineData.push(newKlineData)
              await saveKlineData(base, counter, cycle[i].name, klineData);
            }
          } else { // 币种对在周期内无数据
            let time = getTimeByCycle(timestamp, cycle[i].name)
            newKlineData = [time, price.toString(), price.toString(), price.toString(), price.toString(), amount.toString(), volume.toString(), 1]
            klineData.push(newKlineData);
            await saveKlineData(base, counter, cycle[i].name, klineData);
          }
        }
        resolve("保存成功")
      } catch (error) {
        reject(error)
      }
    })
  }

};

