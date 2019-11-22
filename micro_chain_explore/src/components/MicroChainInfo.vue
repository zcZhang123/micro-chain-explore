<template>
  <div class="micro-chain">
    <ul class="micro-chain-div">
      <li>
        <span>子链部署者地址：</span>
        <span>{{microChainInfo.sender}}</span>
      </li>
      <li>
        <span>SCS节点地址：</span>
        <span>{{microChainInfo}}</span>
      </li>
      <li>
        <span>余额：</span>
        <span>{{microChainInfo.Balance}}</span>
      </li>
      <li>
        <span>应用链节点押金：</span>
        <span>{{microChainInfo.BondLimit}}</span>
      </li>
      <li>
        <span>区块奖励：</span>
        <span>{{microChainInfo.BlockReward}}</span>
      </li>
      <li>
        <span>交易奖励：</span>
        <span>{{microChainInfo.TxReward}}</span>
      </li>
      <li>
        <span>接入奖励：</span>
        <span>{{microChainInfo.ViaReward}}</span>
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
      console.log(res);
    }
  }
};
</script>
<style lang="scss" scoped>
.micro-chain-div {
  width: 97%;
  overflow: hidden;
  border: 1.8px solid #c1e9f1;
  height: 120px;
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
}
</style>