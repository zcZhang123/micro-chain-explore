<template>
  <div class="micro-chain">
    <ul class="micro-chain-div">
      <li>
        <div class="micro-chain-li-div">
          <el-tooltip
            class="item"
            effect="light"
            content="部署应用链时需要消耗母链的原生moac，提供这些moac的帐号即成为应用链部署者。"
            placement="top"
          >
            <img src="../../static/image/help.png" width="14px" height="14px" />
          </el-tooltip>
          <span>子链部署者地址：</span>
          <span>{{microChainInfo.owner}}</span>
        </div>
        <div class="micro-chain-li-div">
          <el-tooltip
            class="item"
            effect="light"
            content="应用链帐号的moac余额，由三个部分组成，应用链节点押金，应用链原生货币兑换押金，应用链可用运行押金。"
            placement="top"
          >
            <img src="../../static/image/help.png" width="14px" height="14px" />
          </el-tooltip>
          <span>余额：</span>
          <span>{{getBalance()}}</span>
        </div>
      </li>
      <li>
        <div class="micro-chain-li-scs">
          <el-tooltip
            class="item"
            effect="light"
            content="存储应用链矿工的池子，本质上是一个智能合约。SCS节点需要注册才能加入应用链的验证。当应用链产生之后，会注册到一个SCS pool里面，并随机抽取符合条件的SCS加入应用链进行验证。"
            placement="top"
          >
            <img src="../../static/image/help.png" width="14px" height="14px" />
          </el-tooltip>
          <span>SCS节点地址：</span>
          <span v-for="SCS in microChainInfo.ScsList" :key="SCS">{{SCS}}</span>
        </div>
      </li>
      <li>
        <div class="micro-chain-li-div">
          <el-tooltip
            class="item"
            effect="light"
            content="当SCS在SCS pool中，被应用链选中时，需要缴纳押金才能为应用链进行验证。"
            placement="top"
          >
            <img src="../../static/image/help.png" width="14px" height="14px" />
          </el-tooltip>
          <span>应用链节点押金：</span>
          <span>{{microChainInfo.BondLimit}}</span>
        </div>
        <div class="micro-chain-li-div">
          <el-tooltip class="item" effect="light" content="应用链给予每个区块的收益。" placement="top">
            <img src="../../static/image/help.png" width="14px" height="14px" />
          </el-tooltip>
          <span>区块奖励：</span>
          <span>{{microChainInfo.BlockReward}}</span>
        </div>
      </li>
      <li>
        <div class="micro-chain-li-div">
          <el-tooltip
            class="item"
            effect="light"
            content="为了鼓励SCS对更多的交易进行验证，应用链对每个打包的交易都提供了奖励。"
            placement="top"
          >
            <img src="../../static/image/help.png" width="14px" height="14px" />
          </el-tooltip>
          <span>交易奖励：</span>
          <span>{{microChainInfo.TxReward}}</span>
        </div>
        <div class="micro-chain-li-div">
          <el-tooltip class="item" effect="light" content="应用链给予VNODE连接节点的奖励。" placement="top">
            <img src="../../static/image/help.png" width="14px" height="14px" />
          </el-tooltip>
          <span>接入奖励：</span>
          <span>{{microChainInfo.ViaReward}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { getMicroChainInfo } from "../js/request";
import { chain3 } from "../js/utils";
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
    },
    getBalance() {
      return chain3.fromSha(chain3.mc.getBalance(process.env.MICRO_CHAIN));
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
.micro-chain-li-scs {
  display: flex;
  align-items: center;
}
.micro-chain-li-div {
  display: flex;
  align-items: center;
  width: 50%;
}
</style>