module.exports = {

  friendlyName: 'Get ticker info',

  description: '',

  inputs: {
    klineData: {
      type: 'json'
    }
  },

  exits: {

  },

  fn: async function ({ klineData }) {
    try {
      let len = klineData.length;
      if (len > 0) {
        let lastData = klineData[len - 1];
        let data = klineData[len - 2];
        let today = Utils.getTodayTimestamp();
        let ticker = [];
        if (lastData[0] == today) {
          let change = (parseFloat(lastData[2]) - parseFloat(data[2])) / parseFloat(data[2])
          ticker = [today / 1000, lastData[2], change, lastData[4], lastData[3], lastData[5], lastData[6], lastData[7]]
        } else {
          ticker = [today / 1000, lastData[2]]
        }
        return ticker;
      } else {
        return []
      }
    } catch (error) {
      return error
    }
  }

};

