<template>
  <div class="micro-chain">
    <ul class="micro-chain-div">
      <li>
        <div class="micro-chain-li-div">
          <span>子链部署者地址：</span>
          <span>{{microChainInfo.Sender}}</span>
        </div>
        <div class="micro-chain-li-div">
          <span>余额：</span>
          <span>{{microChainInfo.Balance}}</span>
        </div>
      </li>
      <li>
        <span>SCS节点地址：</span>
        <span v-for="SCS in microChainInfo.ScsList" :key="SCS">{{SCS}}</span>
      </li>
      <li>
        <div class="micro-chain-li-div">
          <span>应用链节点押金：</span>
          <span>{{microChainInfo.BondLimit}}</span>
        </div>
        <div class="micro-chain-li-div">
          <span>区块奖励：</span>
          <span>{{microChainInfo.BlockReward}}</span>
        </div>
      </li>
      <li>
        <div class="micro-chain-li-div">
          <span>交易奖励：</span>
          <span>{{microChainInfo.TxReward}}</span>
        </div>
        <div class="micro-chain-li-div">
          <span>接入奖励：</span>
          <span>{{microChainInfo.ViaReward}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { getMicroChainInfo } from "../js/request";
export default {
  name: "MicroChainInfo",
  data() {
    return {
      microChainInfo: {}
    };
  },
  created() {
    this.getChainIfo();
  },
  methods: {
    async getChainIfo() {
      let res = await getMicroChainInfo();
      this.microChainInfo = res;
    }
  }
};
</script>
<style lang="scss" scoped>
.micro-chain {
  margin: 10px 60px 10px 60px;
}
.micro-chain-div {
  width: 97%;
  overflow: hidden;
  border: 1.8px solid #c1e9f1;
  height: 170px;
  border-radius: 8px;
  background: #ffffff;
  margin-bottom: 20px;
  li {
    display: flex;
    justify-content: space-between;
    height: 40px;
    overflow: hidden;
    font-size: 14px;
    line-height: 40px;
    padding: 0 20px;
    color: #5f5d5d;
    border-bottom: 1px solid #e0e8ed;
  }
  span {
    float: left;
  }
}
.micro-chain-li-div {
  width: 50%;
}
</style>