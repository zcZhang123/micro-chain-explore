<template>
  <div class="search-box">
    <el-input size="medium" v-model="addressOrHash" placeholder="请输入地址/哈希"></el-input>
    <el-button type="primary" size="medium" icon="el-icon-search" @click="search"></el-button>
  </div>
</template>

<script>
import { getHashType } from "../js/request";
var Chain3 = require("chain3");
var chain3 = new Chain3();
export default {
  name: "SearchBox",
  data() {
    return {
      addressOrHash: ""
    };
  },
  methods: {
    async search() {
      let isAddress = chain3.isAddress(this.addressOrHash);
      if (isAddress) {
        let url =
          window.location.origin +
          `/#/walletDetail/?address=${this.addressOrHash}`;
        window.open(url, "_blank");
      } else {
        let type = await getHashType(this.addressOrHash);
        if (type === 0) {
          let url =
            window.location.origin +
            `/#/blockDetail/?hash=${this.addressOrHash}`;
          window.open(url, "_blank");
        } else if (type === 1) {
          let url =
            window.location.origin +
            `/#/tradeDetail/?hash=${this.addressOrHash}`;
          window.open(url, "_blank");
        } else {
          alert("请输入正确的地址/哈希");
        }
      }
    }
  }
};
</script>
<style  lang="scss" scoped>
.search-box .el-input {
  width: 300px !important;
}
.search-box .el-button {
  background: #3498db !important;
}
</style>